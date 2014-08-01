
DK3D.Engines = {};
DK3D.Engines.DefaultEngine = {
  openLink : function(link) {
    window.open(link,'_blank');
  },
  videoSources : {
//    'video/mp4' : 'mp4',
    'video/webm' : 'webm'
    //Fill the other codeds!
  },
  playVideo : function(sources) {

  },

  setupPhysics : function() {
    Physijs.scripts.ammo = 'ammo.js'
    Physijs.scripts.worker = 'js/physi.js/physijs_worker.js';
  },

  playInlineVideo : true, 
  workerScript: 'js/physi.js/physijs_worker.js',
  setupControls : function(world) {
    document.body.addEventListener('touchstart', false);
    var script = document.createElement('script');
    var world = world;
    script.setAttribute('async','false');
    script.setAttribute('defer','false');
    script.setAttribute('src','js/dk3d/FPControls.js');
    script.onload = function() {
      console.log(world.avatar.name + '< is my avatar');
      var controls = new DK3D.FPControls(world.avatar,document.getElementsByTagName('canvas'));
      controls.world = world;
      controls.movementSpeed = 120; // How fast the player can walk around
      controls.lookSpeed = 0.3; // How fast the player can look around with the mouse
      controls.constrainVerticalLook = true;
      controls.noFly = true; // Don't allow hitting R or F to go up or down
      world.controls = controls;
    };
    document.body.appendChild(script);

   },
  setupContainer : function(world) {
    var container = world.attrs.container;
    var world = world

  
    container.appendChild( world.renderer.domElement );
    container.addEventListener('resize', function() {
      world.avatar.camera.aspect = window.innerWidth / window.innerHeight;
      world.avatar.camera.updateProjectionMatrix();
      world.renderer.setSize( window.innerWidth, window.innerHeight );
      world.controls.handleResize();
    });
    container.addEventListener('mouseout', function() {
      if (world.controls) {
        console.log('turning controls off');
        world.controls.freeze=true;
      }
    });
    container.addEventListener('mouseover', function() {
      if (world.controls) {
        console.log('turning controls on again');
        world.controls.freeze=false;
      }
    });

    container.addEventListener('click',function(event) {
      world.onclick(event.pageX,event.pageY);
      event.stopPropagation();
    });
    
    container.addEventListener('touchend',function(event) {
      console.log(event.touches.length);
      world.onclick(event.touches[0].pageX,event.touches[0].pageY);
      event.stopPropagation();
    });
    
    if (document.ontouchstart !== undefined) {
      //Create simple control elements here
      var moveL = document.createElement('div');
      moveL.setAttribute('style','width:64px;height:64px;position:absolute;z-index:99;bottom:55px;left:5px;background-color:black;opacity:0.5');
      moveL.setAttribute('class','vkey');
      moveL.innerHTML="A";

      var moveR = document.createElement('div');
      moveR.setAttribute('style','width:64px;height:64px;position:absolute;z-index:99;bottom:55px;left:136px;background-color:black;opacity:0.5');
      moveR.setAttribute('class','vkey');
      moveR.innerHTML="D";

      var moveB = document.createElement('div');
      moveB.setAttribute('style','width:64px;height:64px;position:absolute;z-index:99;bottom:17px;left:71px;background-color:black;opacity:0.5');
      moveB.setAttribute('class','vkey');
      moveB.innerHTML="S";

      var moveF = document.createElement('div');
      moveF.setAttribute('style','width:64px;height:64px;position:absolute;z-index:99;bottom:89px;left:71px;background-color:black;opacity:0.5');
      moveF.setAttribute('class','vkey');
      moveF.innerHTML="W";

      moveR.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyDown({keyCode : 68});
        return true;
      });
      moveR.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyUp({keyCode : 68});
        return true;
      });

      moveF.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyDown({keyCode : 87});
        return true;
      });
      moveF.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyUp({keyCode : 87});
        return true;
      });
      moveB.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyDown({keyCode : 83});
        return true;
      });
      moveL.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyUp({keyCode : 65});
        return true;
      });

      moveL.addEventListener('touchstart', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyDown({keyCode : 65});
        return true;
      });
      moveB.addEventListener('touchend', function(e) {
        e.stopPropagation();
        e.preventDefault();
        world.controls.onKeyUp({keyCode : 83});
        return true;
      });
      container.appendChild(moveL);
      container.appendChild(moveR);
      container.appendChild(moveB);
      container.appendChild(moveF);
    }

  },
  playVideo : function(videoElement) {
    console.log(videoElement);
    console.log('Video play called');
    var d = document.createElement('div');

    var closeMethod = function() {
      var e = document.getElementsByClassName('playerContent');
      for (var i in e) {
        e[i].remove();
      }
    }

    d.setAttribute('class','playerContent');
    videoElement.controls=true;
    d.appendChild(videoElement);
    document.getElementById('container').appendChild(d);

    var close = document.createElement('div');
    close.innerHTML='X';
    close.setAttribute('class', 'close');

    close.addEventListener('click',function() {
        closeMethod();
        e.stopPropagation();
    });
    close.addEventListener('touchend',function() {
        closeMethod();
        e.stopPropagation();
    });

   d.appendChild(close);

   document.getElementById('page').appendChild(d);

  },
  setupRenderer : function(world) {
    world.renderer = new THREE.WebGLRenderer();
    world.renderer.setSize(world.attrs.width,world.attrs.height);

    window.addEventListener('resize', function() {
        console.log('resize');
				world.renderer.setSize( window.innerWidth, window.innerHeight );

				world.avatar.camera.aspect = window.innerWidth / window.innerHeight;
				world.avatar.camera.updateProjectionMatrix();

    });
  },
  scenePath : function(code) {
    return "data/scenes/"+code;
  },
  assetsPath : 'data/assets',
  loadCustomScript : function(world) {
    var script = document.createElement('script');
    script.setAttribute('async','false');
    script.setAttribute('defer','false');
    script.setAttribute('src','data/scenes/' + world.code + '/init.js');
    script.onload = function(e) {
      if (SceneCustomMethods.onUpdate) {
        world.sceneOnUpdate = SceneCustomMethods.onUpdate.bind(world);
      }
      if (SceneCustomMethods.onCreate) {
        world.sceneOnCreate = SceneCustomMethods.onCreate.bind(world);
      }
      world.sceneOnCreate();
      world.onCreate();
      document.dispatchEvent(new Event('worldReady'));
    };
    document.body.appendChild(script);
  },
  screensPath : "data/screens/",
  overlayPath: "img/overlays"
};

DK3D.EjectaEngine = {
  openLink : function() {},
  videoSources : {
    'video/mp4' : 'mp4',
    'video/webm' : 'webm'
  },
  setupPhysics : function() {
    Physijs.scripts.ammo = 'assets/scene3d/js/physi.js/ammo.js'
    Physijs.scripts.worker = 'assets/scene3d/js/physi.js/physijs_worker.js';
  },
  playVideo : DK3D.Engines.DefaultEngine.playVideo,
  playInlineVideo : false,
  workerScript : 'assets/scene3d/' + DK3D.Engines.DefaultEngine.workerScript,
  setupControls : function() {
    'assets/scene3d/js/dk3d/iOSControls.js' //FIXME!!! 
    return(DK3D.iOSControls);
  },
  setupContainer : function() {
    return true
  },
  setupRenderer : function(world) {
    world.renderer = new THREE.WebGLRenderer({canvas : document.getElementById('canvas')});
  },
  scenePath: function(code) {
    //FIXME
  },
  assetsPath : 'assets/scene3d/data/assets',
  screensPath: 'assets/scene3d/data/screens',
  overlayPath: "asset/scene3d/data/overlays",
}
DK3D.getEngine = function() {
  if (window.navigator.userAgent.indexOf('Ejecta') != -1) {
    return(DK3D.Engines.EjectaEngine);
  } else {
    return (DK3D.Engines.DefaultEngine);
  }
}
