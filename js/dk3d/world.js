DK3D.World = function(code,attrs) {
    var self = this;
    // Set default scene parameters
    this.physics = true;
    this.objs3d = {};
    this.bbs = [];
    this.screens = {};
    this.lights = {};
    this.videoScreens = [];
    this.screenMaterials = [];
    this.code = code;
    this.engine = DK3D.getEngine();
    this.screenMeshes = [];

    this.avatarPosV0 = new THREE.Vector3(0,0,0);
    this.avatarPosV1 = new THREE.Vector3(0,0,0);

    this.projector = new THREE.Projector()
    if (typeof attrs === 'undefined') {
        this.attrs = {};
    } else {
        this.attrs = attrs;
    }
    this.running = false;


    if (typeof this.attrs.width !== 'number') { this.attrs.width=window.innerWidth}
    if (typeof this.attrs.height !== 'number') { this.attrs.height=window.innerHeight}
    if (typeof this.attrs.debug !== true) { this.attrs.debug=false}
    if (typeof this.attrs.container !== 'object') {this.attrs.container = document.body}

    this.debug = attrs.debug;
    self.engine.setupPhysics();

  this.clock = new THREE.Clock();

  this.scene = new Physijs.Scene({ fixedTimeStep: 1 / 60 });
  this.scene.setGravity(new THREE.Vector3( 0, -1000, 0 ));

  // Initialize avatar

  this.avatarGeometry = new THREE.SphereGeometry(20);
  this.avatarMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({wireframe : true, 'color' : 0xff0000, side: 2}), 0,0);
  this.avatar = new Physijs.CapsuleMesh(this.avatarGeometry, this.avatarMaterial, 100);
  this.avatar.name = 'Avatar'
  this.avatar.visible=false;

  this.bbMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({'color':0xff0000,'wireframe':true}),0, 0);

  // Initialize camera

  this.avatar.camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,50,10000000)

  this.engine.setupRenderer(this);
  this.engine.setupContainer(this,this.attrs.container);

  this.renderer.setSize(this.attrs.width,this.attrs.height);


  this.onCreate = function() {
    this.scene.add(this.avatar);
      for (var b in self.bbs) {
        var bb = self.bbs[b]

        var b = new Physijs.BoxMesh(new THREE.CubeGeometry(bb.size[0],bb.size[1],bb.size[2]),self.bbMaterial,0);
        b.position.x=bb.pos[0];
        b.position.y=bb.pos[1];
        b.position.z=bb.pos[2];
        b.rotation.x=bb.rot[0];
        b.rotation.y=bb.rot[1];
        b.rotation.z=bb.rot[2];
        if (!this.debug) b.visible=false;
        self.scene.add(b);
      }

    for(var obj in this.objs3d) {
      this.scene.add(this.objs3d[obj]);
      this.objs3d[obj].updateMatrix();
    }
    for(var light in this.lights) {
      this.scene.add(this.lights[light]);
    }
    if (this.debug){
      var ax = new THREE.AxisHelper(10000);
      this.scene.add(ax);
    }
    this.controls = new DK3D.FPControls(this.avatar,this.attrs.container);
    this.controls.world = self;

  }
  this.initializer = new DK3D.SceneInitializer(this);
 
  this.onUpdate = function() {
    this.avatar.camera.position.x = this.avatar.position.x
    this.avatar.camera.position.y = this.avatar.position.y+20;
    this.avatar.camera.position.z = this.avatar.position.z;
    for (var s in this.videoScreens) { 
      var screen = this.screens[this.videoScreens[s]];
      if (screen.video.readyState === screen.video.HAVE_ENOUGH_DATA ) {
        screen.updateVideoFrame();
      }
    }
  }
  this.sceneOnCreate = function() {
  };

  this.sceneOnUpdate = function() {
  }
  
  this.start = function() {
    setInterval(function() {
        self.render();
    },1000/30);
  }
  this.render = function() {
    this.onUpdate();
    this.sceneOnUpdate();

    var dt = this.clock.getDelta();
    if (dt > 0.05) dt = 0.05;

   if (this.controls) {
      this.controls.update(dt);
    }
    this.scene.simulate();
    this.renderer.render(this.scene,this.avatar.camera);

  }
    this.onclick = function(posX,posY) {
      console.log('TAP');
        var mouse3D = new THREE.Vector3();
        mouse3D.x = (posX/this.attrs.container.offsetWidth) * 2 - 1;
        mouse3D.y = -(posY/this.attrs.container.offsetHeight) * 2 + 1;
        mouse3D.z = 1;

        var pos = this.avatar.camera.matrixWorld.getPosition().clone();

        this.projector.unprojectVector(mouse3D, this.avatar.camera);

        var ray = new THREE.Raycaster( pos, mouse3D.sub( pos ).normalize() );
        var intersects = ray.intersectObjects( this.scene.children,true );

        if (intersects.length > 0) {
            for (i=0;i<intersects.length;i++) {
                if (intersects[i].object.name.substring(0, 7) == "screen-") {
                    var num = intersects[i].object.name.substr(7);
                    self.screens[num].onPick();
                    event.stopPropagation();
                    return(true);
                } else {
                  try {
                    if (intersects[i].object.material.materials[intersects[i].face.materialIndex].name.substring(0,7) == 'screen-') {
                      var num = intersects[i].object.material.materials[intersects[i].face.materialIndex].name.substr(7);
                      self.screens[num].onPick();
                      event.stopPropagation();
                      return(true)
                    } 
                  }catch(err) {} 
                }
            }
        }
        return(false);
    }
} 

