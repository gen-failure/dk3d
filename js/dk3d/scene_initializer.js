DK3D.SceneInitializer = function(world) {
  var self = this;
  this.scenePath = world.engine.scenePath(world.code);
  this.world = world;
  this.objectsToLoad = 0;
  this.screensToLoad = 0;
  this.props = {};
  this.loader = new THREE.JSONLoader();

  this.buildScene = function() {
    //add active Matarials 
    this.world.screenMaterials= this.props.screenMaterials; 
    //setup ambient light
    try {
      if (this.props.ambientLight.active) {
        world.scene.add(new THREE.AmbientLight(this.props.ambientLight.color));
      }
    } catch(err) {}
    //TODO: implement other lights then point and directional
    for (var light in this.props.lights) {
      switch(this.props.lights[light].type) {
      case 'point':
        var newLight = new THREE.PointLight(this.props.lights[light].color,this.props.lights[light].intensity);
        newLight.position.x = this.props.lights[light].pos.x;
        newLight.position.y = this.props.lights[light].pos.y;
        newLight.position.z = this.props.lights[light].pos.z;
        this.world.lights[light] = newLight;
      case 'spot':
        var newLight = new THREE.DirectionalLight(this.props.lights[light].color,this.props.lights[light].intensity,this.props.lights[light].distance,this.props.lights[light].angle);
        newLight.position.x = this.props.lights[light].pos.x;
        newLight.position.y = this.props.lights[light].pos.y;
        newLight.position.z = this.props.lights[light].pos.z;
        //newLight.target.position.set(this.props.lights[light].target);
        this.world.lights[light] = newLight;
      }
    }
    //TODO: Implement bouncing boxes loading!
    this.world.bbs= this.props.bouncings;

    //load objects
    for (var name in this.props.objects) {
      this.loadModel(name, this.props.objects[name]);
    }
  };
  this.loadModel = function(name,attrs) {
    console.log('loading model ' + name);
    var attrs = attrs;
    console.log(this.scenePath + '/models/' + name);
    this.loader.load(this.scenePath + '/models/' + name + '/' + name +'.json', function(geometry,materials) {
      if (attrs.fix_sides) {
        for (var m in materials) {
          materials[m].side=THREE.DoubleSide;
        }
      }
      var faceMaterial = new THREE.MeshFaceMaterial(materials);
      if (attrs.fix_sides) faceMaterial.side=THREE.DoubleSide;
      geometry.buffersNeedUpdate = true;
      geometry.uvsNeedUpdate = true;
      var mesh = new THREE.Mesh(geometry, faceMaterial);
      mesh.scale.x = attrs.scale.y;
      mesh.scale.y = attrs.scale.y;
      mesh.scale.z = attrs.scale.z;
      mesh.rotation.x = attrs.rot.x;
      mesh.rotation.y = attrs.rot.y;
      mesh.rotation.z = attrs.rot.z;
      mesh.position.x = attrs.pos.x;
      mesh.position.y = attrs.pos.y;
      mesh.position.z = attrs.pos.z;

      self.world.objs3d[name] = mesh;
      self.objectsToLoad -= 1
      console.log('models to load' + self.objectsToLoad)
      if (self.objectsToLoad == 0) {
        //this is of inline screens problem
        self.loadScreens();
      }
    },this.scenePath + '/models/' + name);
  };
  this.loadScreens = function() {
    for (var screen in this.props.screens) {
      //TODO: For external screens, add model first!
      var newScreen = new DK3D.Screen(this.props.screens[screen],screen,this.world);
      self.world.screens[screen] = newScreen;
    }
    this.loadSceneScript();
  };
  this.loadSceneScript = function() {
    this.world.engine.loadCustomScript(world);
  }
  microAjax(this.scenePath + '/' + 'props.json', function(res) {
      self.props = JSON.parse(res);
      rrr = self.props; 
      self.objectsToLoad = Object.keys(self.props.objects).length;
      self.screensToLoad = Object.keys(self.props.screens).length;
      console.log(self.props);
      self.buildScene();
  });

}
