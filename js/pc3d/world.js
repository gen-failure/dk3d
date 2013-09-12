PC3D.World = function(code,attrs) {

    // Set default scene parameters
    this.objs3d = {};

    if (typeof attrs === 'undefined') {
        this.attrs = {};
    } else {
        this.attrs = attrs;
    }

    if (typeof this.attrs.width !== 'number') { this.attrs.width=window.innerWidth}
    if (typeof this.attrs.height !== 'number') { this.attrs.height=window.innerHeight}
    if (typeof this.attrs.debug !== 'boolean') { this.attrs.boolean=false}

    this.code = code;

	Physijs.scripts.ammo = 'ammo.js'
	Physijs.scripts.worker = 'js/physi.js/physijs_worker.js';

	this.clock = new THREE.Clock();

	this.scene = new Physijs.Scene({ fixedTimeStep: 1 / 60 });
	this.scene.setGravity(new THREE.Vector3( 0, -1000, 0 ));

	// Initialize avatar

	this.avatarGeometry = new THREE.CylinderGeometry(8,8,20);
	this.avatarMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({'color' : 0xff0000, 'wireframe' : true}), 0,0);
	this.avatar = new Physijs.CapsuleMesh(this.avatarGeometry, this.avatarMaterial, 0.1);
	this.avatar.position.set(0,20,0)
	this.avatar.name = 'Avatar'
	this.avatarV0 = new THREE.Vector3;
	this.avatarV1 = new THREE.Vector3;

    this.bbMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({'color':0xff0000,'wireframe':true,'side':2}),0, 0);

	if (!this.debug) {
		this.avatar.visible=false;
        this.bbMaterial.transparent = true;
        var ax = new THREE.AxisHelper(10000);
		ax.position.y=20;
		this.scene.add(ax);
	}

	this.scene.add(this.avatar);

	// Initialize camera

	this.avatar.camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight,1,10000)

	//Set up axis helper
	if (this.debug) {

	}
	// Set up renderer
	if (Detector.webgl) {
		this.renderer = new THREE.WebGLRenderer();
	} else {
		this.renderer = new THREE.CanvasRenderer();
	}

	this.renderer.setSize(this.attrs.width,this.attrs.height);
	
	//Scene 'methods'

	this.useFPControls = function() {
		this.controls = new PC3D.FPControls(this.avatar.camera); // Handles camera control
		this.controls.movementSpeed = 75; // How fast the player can walk around
		this.controls.lookSpeed = 0.05; // How fast the player can look around with the mouse
		this.controls.lookVertical = true // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
		this.controls.constrainVerticalLook = true;
		this.controls.noFly = true; // Don't allow hitting R or F to go up or down
	}

	this.setContainer = function(container) {
		container.appendChild( this.renderer.domElement );
		container.addEventListener('resize', function() {
			this.avatar.camera.aspect = window.innerWidth / window.innerHeight;
			this.avatar.camera.updateProjectionMatrix();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		});
		container.addEventListener('mouseout', function() {
			if (this.controls) {
				this.controls.freeze=true;
			}	
		});
		container.addEventListener('mousein', function() {
			if (this.controls) {
				this.controls.freeze=false;
			}	
		});
	}

	this.loadPresentation = function(t) {
		js = document.createElement('script');
		js.type="text/javascript";
		js.src= "data/scenes/" + this.code + "/init.js"
		document.body.appendChild(js);
		js.addEventListener('load', function() {
			renderPresentation();
		});

	}

	this.start = function() {
		requestAnimationFrame(this.start.bind(this));
		this.render();

	}
	this.render = function() {
		dt = this.clock.getDelta();
		if (dt > 0.05) dt = 0.05;

        // Move Avatar


      this.avatar.camera.position.x = this.avatar.position.x
      this.avatar.camera.position.y = this.avatar.position.y+15
      this.avatar.camera.position.z = this.avatar.position.z
		if (this.controls) {
/*			this.avatarV0.set(this.avatar.camera.position.x,0,this.avatar.camera.position.z);
			this.controls.update(dt);
			this.avatarV1.set(this.avatar.camera.position.x,0,this.avatar.camera.position.z);
			this.avatarV1.sub(this.avatarV0);
			this.avatarV1.divideScalar(dt);
			vy = this.avatar.getLinearVelocity.y;
			this.avatar.setLinearVelocity({x: this.avatarV1.x,y:vy < 0 ? vy : 0, z: this.avatarV1.z});
			this.controls.object.position.set(this.avatar.position.x,this.avatar.position.y+10,this.avatar.position.z);
			this.avatar.rotation.copy(this.avatar.camera.rotation);
			this.avatar.__dirtyRotation = true; */
		}

    renderInitializer();

		this.scene.simulate();

		this.renderer.render(this.scene,this.avatar.camera);
	}
} 
