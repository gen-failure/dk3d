    require('js/3th_party/microajax.js');
    require('js/3th_party/json2.js');
		require('js/three.js/three.js');
		require('js/three.js/Detector.js');
		require('js/physi.js/physi.js');
		require('js/dk3d/dk3d.js');
		require('js/dk3d/FPControls.js');
		require('js/dk3d/engine.js');
    require('js/dk3d/scene_initializer.js');
    require('js/dk3d/screen.js');
    require('js/dk3d/screen_types.js');
		require('js/dk3d/world.js');

      document.addEventListener('worldReady',function() {
			world = new DK3D.World('TEST001', {debug:true, container : document.getElementById('container')});
    });
