/* 
* @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 * @author darkencz
 */

DK3D.FPControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 390.0;
	this.lookSpeed = 0.15;

	this.lookVertical = true;
	this.autoForward = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.freeze = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

  if ( this.domElement !== document ) {
    this.domElement.setAttribute( 'tabindex', -1 );
  }


	this.handleResize = function () {
    if ( this.domElement === document ) {

      this.viewHalfX = window.innerWidth / 2;
      this.viewHalfY = window.innerHeight / 2;

    } else {
      this.viewHalfX = this.domElement.offsetWidth / 2;
      this.viewHalfY = this.domElement.offsetHeight / 2;

    }
	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}


    if (event.button == 1 || event.button==2 || event.button === undefined) {
      event.preventDefault();
		  event.stopPropagation();

  		this.mouseDragOn = true;
    }
	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {
    if (event.touches) {


      pX = event.touches[0].pageX;
      pY = event.touches[0].pageY;
    } else {
      pX = event.pageX;
      pY = event.pageY;
    }

    if (this.mouseDragOn || event.gesture) {
      if ( this.domElement === document ) {
        this.mouseX = pX - this.viewHalfX;
        this.mouseY = pY - this.viewHalfY;
      } else {
        this.mouseX = pX - this.domElement.offsetLeft - this.viewHalfX;
        this.mouseY = pY - this.domElement.offsetTop - this.viewHalfY;
      }
    }
    event.preventDefault();
    event.stopPropagation();

	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 82: /*R*/ this.moveUp = true; break;
			case 70: /*F*/ this.moveDown = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};


	this.update = function( delta ) {
		if ( this.freeze ) {

			return;

		}
    
    var newVector = new THREE.Vector3(0,0,0);
    var oldVector = this.object.getLinearVelocity();
    newVector.y = oldVector.y;
    //this.object.camera.rotation.y = this.object.camera.rotation.y % (Math.PI);
    var c;
    var s = Math.sin(this.object.camera.rotation.y);
    if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) {
      if (this.target.z < this.object.camera.position.z ) {
        c = Math.cos(this.object.camera.rotation.y)*-1;
      } else {
        c = Math.cos(this.object.camera.rotation.y);

      }
      if ( this.moveForward && !this.moveBackward ) {
          newVector = new THREE.Vector3(this.movementSpeed * s *-1,0,this.movementSpeed*c);
      }
      if ( this.moveBackward ) {
          newVector = new THREE.Vector3(this.movementSpeed * s,0,this.movementSpeed*c * -1);
      }
      if ( this.moveLeft && !this.moveRight) {
          newVector.add(new THREE.Vector3(this.movementSpeed * c,0,this.movementSpeed*s));
      }
      if ( this.moveRight ) {
         newVector.add(new THREE.Vector3(this.movementSpeed * c*-1,0,this.movementSpeed*s*-1));
      }
    }
/*		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed ); */

    if(Math.round(newVector.x) != Math.round(oldVector.x) || Math.round(newVector.z) != Math.round(oldVector.z) || (oldVector.x != 0 || oldVector.z != 0)) {
      this.object.setLinearVelocity(newVector);
    }

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook || !this.mouseDragOn ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) { this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio; }

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.camera.lookAt( targetPosition );

	};



  if (document.ontouchstart !== undefined) {
  	this.domElement.addEventListener( 'touchstart', bind( this, this.onMouseDown ), false );
    this.domElement.addEventListener( 'touchend', bind( this, this.onMouseUp ), false );
  	this.domElement.addEventListener( 'touchmove', bind( this, this.onMouseMove ), false );
  } else {
    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
    this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
    this.domElement.addEventListener( 'mouseup', bind( this, this.onMouseUp ), false );
    this.domElement.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
    this.domElement.addEventListener( 'keyup', bind( this, this.onKeyUp ), false );
  }

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();
};
