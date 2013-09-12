PC.ScreenSet = function() {
	screens = [];
}

PC.Screen = function(position,rotation,width,height,depth) {
	this.position = position || new THREE.Vector3(0,0,0);
	this.rotation = position ||  new THREE.Vector3(0,0,0);
	this.width = width || 192;
	this.height = height || 138;
	this.depth = depth || 10;

	this.defaultMaterial = new THREE.MeshBasicMaterial({color:0x111111,side:2});
	this.activeMaterial = new THREE.MeshBasicMaterial({color:0xff0000,side:2});

	this.video = null;
	this.image = null;


	this.texture = null;

	this.overlay = null;

	this.link = "http://google.com";
	this.object_type = null;
	
	this.drawScreen = function() {
		
	}

	this.setAction(action) {
		switch(action) {
			case 'link':
				break;
			case 'play':
				break;
			default:
			
		}
	}

	this.setObjectType = function(obj_type) {
		switch(obj_type) {
			case 'video':
				break;
			case 'audio':
				break;
			case 'image':
				break;
			default:
			
		}
	}
	this.setOverlayType = function(ovr_type) {
		switch(ovr_type) {
			case 'video':
				break;
			case 'pdf':
				break;
			case 'audio';
				break;
			default:
		}
	}
	this.setVideo = function(video) {
		this.video = video;
	}
	this.setAudio = function(audio) {
		
	}
	this.setImage = function(image) {

	}

}
