renderPresentation = function()  {

	scene = world.scene;

	//Setup the lights for the show
	ambient = new THREE.AmbientLight('0x668888');
	ambient.name="ambLight";
//	scene.add( ambient );

	world.objs3d.l1 = new THREE.PointLight( 0x44ff44, 1.75 );
	world.objs3d.l1.position.set( 700, 300, 700 );
  scene.add( world.objs3d.l1 );

	world.objs3d.l2 = new THREE.PointLight( 0xff44ff, 1.75 );
	world.objs3d.l2.position.set( -700, 300, -700 );
	scene.add(world.objs3d.l2 );

	world.objs3d.l3 = new THREE.PointLight( 0x44ffff, 1.75 );
	world.objs3d.l3.position.set( -700, 300, 700 );
	scene.add( world.objs3d.l3 );

	world.objs3d.l4= new THREE.PointLight( 0xffff44, 1.75 );
	world.objs3d.l4.position.set( 700, 300, -700 );
	scene.add(world.objs3d.l4);


	floorTexture = new THREE.ImageUtils.loadTexture( 'assets/scene3d/data/scenes/' + world.code + '/files/grid.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 250, 250 );
	floorTexture.anisotropy = world.renderer.getMaxAnisotropy();
	floorMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial( { reflectivity:255, map: floorTexture, side: THREE.DoubleSide } ),1,1);
	floorGeometry = new THREE.CubeGeometry(2000, 2000, 15,64,64,1);

  var p1 = new THREE.Geometry();
  for(var i = 0;i < 100 ; i++) {
    var pX = 375  + Math.random() * 50,
        pY = 250 + Math.random() * 55,
        pZ = -490 - Math.random() * 50;
        particle = new THREE.Vertex(
          new THREE.Vector3(pX, pY, pZ)
        );
    p1.vertices.push(particle);
  }
  world.objs3d.particles1 = new THREE.ParticleSystem(p1, new THREE.ParticleBasicMaterial({color : 0xbbddff, size : 20}));
  scene.add(world.objs3d.particles1);


	floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0);
	floor.rotation.x = Math.PI / 2;
	world.scene.add(floor);

	PC3D.loadObject('layout');
    PC3D.loadObject('skybox');
}

function renderInitializer() {
  //world.objs3d.particles1.rotation.y += 0.01;
  world.objs3d.l1.rotation.y += 0.1;
  world.objs3d.l2.rotation.y += 0.1;
  world.objs3d.l3.rotation.y += 0.1;
  world.objs3d.l4.rotation.y += 0.1;
}
