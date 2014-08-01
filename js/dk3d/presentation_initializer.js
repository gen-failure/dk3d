PresentationInitializer = function(world) {
  var self = this;
  this.scenePath = world.engine.scenePath(world.code);
  this.world = world;
  this.objectsToLoad = 0;
  this.screensToLoad = 0;
  this.props = {};
  microAjax(this.scenePath + '/' + 'props.json', function(res) {
      self.objectsToLoad = res.objects.length;
      self.screensToLoad = res.screens.length;
      this.props = JSON.parse(res);
      this.buildScene();
  });
  this.loader = new THREE.JSONLoader();

  this.buildScene = function(props) {
    //setup ambient light
    try {
      if (this.props.ambientLight.active) {
        world.scene.add(new THREE.AmbientLight(this.props.ambientLight.color));
      }
    } catch(err) {}
    //TODO: implement other lights then point
    for (var light in this.props.lights) {
      switch(this.props.lights[light].type) {
      case 'point':
        var newLight = new THREE.PointLight(this.props.lights[light].color,this.props.lights[light]);
        newLight.position.set(props.lights[light].position);
        this.world.lights[light] = newLight;
      }
    }
    //TODO: Implement bouncing boxes loading!
    //load objects
    for (var name in props.objects) {
      this.loadModel(name, props.objects.index);
    }
  };
  this.loadModel = function(name,attrs) {
    this.loader.load(this.scenePath + '/' + name + 'object.json', function(geometry,materials) {
      var faceMaterial = new THREE.MeshFaceMaterial(materials);
      var mesh = new THREE.Mesh(geometry, faceMaterial);
      mesh.scale.set(attrs.scale);
      mesh.rotation.set(attrs.rot);
      mesh.position.set(attrs.pos);
      self.world.objs3d[name] = mesh;
      self.objectsToLoad -= 1
      if (self.objectsToLoad == 0) {
        //this is of inline screens problem
        self.loadScreens();
      }
    });
  };
  this.loadScreens = function() {
    for (var screen in this.props.screens) {
      //TODO: For external screens, add model first!
      var newScreen = new DK3D.Screen(props.screens[screen],screen,world);
      self.world.screens[screen] = newScreen;
    }
  };
  this.loadCustomMethods() {
    world.engine.loadCustomScript();
    if (SceneCustomMethods.onUpdate) {
      World.prototype.sceneOnUpdate = SceneCustomMethods.onUpdate;
    }
    if (SceneCustomMethods.onCreate) {
      World.prototype.sceneOnCreate = SceneCustomMethods.onCreate;
    }
  }
}
