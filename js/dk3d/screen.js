DK3D.Screen = function(props,number,world) {
  var self = this;
  this.screenId = number;
  this.world = world;
  this.props = props;
  this.backgroundColor;
  this.displayCanvas = document.createElement('canvas');
  this.titleCanvas = null;
  this.mesh = null;
  this.video = null;
  this.activeMaterial = null;
  this.actions = [];
  //Inline screens, register with canvas!
  this.activeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, map: new THREE.Texture(this.displayCanvas), overdraw: true});
  this.activeMaterial.name='screen-' + this.screenId;
  this.activeMaterial.map.minFilter = THREE.LinearFilter;
  this.activeMaterial.map.magFilter = THREE.LinearFilter;
  this.videoOffsetX;
  this.videoOffsetY;
  this.videoWidth;
  this.videoHeight;
  
  this.titleMaterial = null;

  this.drawOverlay = function(type) {
    var type = type;
    var oImg = document.createElement('img');
    oImg.src = this.world.engine.overlayPath + '/' +type+'.png';
    oImg.onload = function() {
      self.displayCanvas.getContext('2d').drawImage(oImg,(self.displayCanvas.width/2)-32,(self.displayCanvas.height/2)-32);
    }
  }

  this.setTitle = function(title) {
    if (this.titleCanvas != null) {
      var ctx = this.titleCanvas.getContext('2d');
      ctx.font="10px verdana";
      ctx.fillStyle='#aaffff';
      ctx.textAlign="center"; 
      ctx.fillText(title,this.titleCanvas.width/2,this.titleCanvas.height/2);
      this.titleMaterial.map.needsUpdate=true;
      console.log('settingTitle');
    }
  }

  this.resizeToCanvas = function(x,y) {
    var pos_x = 0;
    var pos_y = 0;
    var new_x = 0;
    var new_y = 0;
    if (x/y > (self.screenWidth()/self.screenHeight())) {
      //We have to align to height
      new_x = self.screenWidth();
      new_y = parseInt(y * (new_x/x));
      pos_x = 0;
      pos_y = (parseInt((self.screenHeight()-new_y)/2) + self.offsetY);
    } else {
      //Lets  align to width
      new_y = self.screenHeight();
      new_x = parseInt(x * (new_y/y));
      pos_y = 0;
      pos_x = (parseInt((self.screenWidth()-new_x)/2)+self.offsetX);
    }
    return ([pos_x,pos_y,new_x,new_y]);
  }

  this.playVideo = function() {
    if (world.renderer.getPrecision() == 'highp') {
      this.video.addEventListener('play', function() {
        var coor= self.resizeToCanvas(self.video.videoWidth,self.video.videoHeight);
        self.videoOffsetX = coor[0];
        self.videoOffsetY = coor[1];
        self.videoWidth = coor[2];
        self.videoHeight = coor[3];
        self.activeMaterial.map.needsUpdate=true
        world.videoScreens.push(self.screenId);

      });
      self.video.play();
    } else {
      world.engine.playVideo(this.video);
    }
  }

  this.screenWidth = function() {
    return (this.displayCanvas.width-this.offsetX)
  }
  this.screenHeight = function() {
    return (this.displayCanvas.height-this.offsetY)
  }
  this.init=function() {
    this.displayCanvas.getContext('2d').fillStyle='#' + this.backgroundColor;
    this.displayCanvas.getContext('2d').fill();
    switch(this.props.content) {
      case 'image':
        console.log(this.props);
        this.loadImage(this.props.contentId);
        break;
      case 'video':
          this.loadVideo(this.props.contentId);
        break;
      case 'link':
        this.loadImage(this.props.contentId,'link')
        break;
     }
  }

  this.loadVideo = function(vidId) {
    this.loadImage(vidId,'video');
    if (this.world.engine.playInlineVideo) {
      this.video = document.createElement('video');
      this.video.preload=false;

      this.video.addEventListener('ended', function() {
        if (self.world.engine.playInlineVideo) self.world.videoScreens.splice(self.world.videoScreens.indexOf(self.screenId),1);
        self.loadImage(self.props.contentId,'video');
      });
      this.video.addEventListener('pause',function() {
        if (self.world.engine.playInlineVideo) self.world.videoScreens.splice(self.world.videoScreens.indexOf(self.screentId),1);
        if (self.video.currentTime == 0) {
          self.loadImage(self.props.contentId,'video');
        } else {
          setTimeout(function() {
            self.drawOverlay('video');
          },100);
        }
      });

      for (var t in self.world.engine.videoSources) {
        var src = document.createElement('source');
        src.setAttribute('src', self.world.engine.assetsPath + '/' + vidId + '/' + vidId + '.' + self.world.engine.videoSources[t]);
        src.setAttribute('type', t);
        this.video.appendChild(src);
      }
   } else {
     //FIX ME for engines without offline video!
    }
  }

  this.updateVideoFrame = function() {
    this.displayCanvas.getContext('2d').drawImage(this.video, this.videoOffsetX, this.videoOffsetY,this.videoWidth,this.videoHeight);
		this.activeMaterial.map.needsUpdate = true;
  }

  this.loadImage = function(imgId,overlay) {
    var imgId = imgId;
    var overlay = overlay;
    var image = document.createElement('img');

    image.onload = function(e) {

      var coor = self.resizeToCanvas(image.width,image.height);
      self.displayCanvas.getContext('2d').drawImage(image,coor[0],coor[1],coor[2],coor[3]);
      self.activeMaterial.map.needsUpdate=true;
      if (overlay != null) self.drawOverlay(overlay);
    };
    image.src = world.engine.assetsPath + "/" + imgId + '/' + imgId + '.jpg';
  }
  this.onPick = function() {
    if (this.video && !this.video.paused) {
      this.video.pause()
    } else if (this.video) {
      this.playVideo();
    }
    if (this.props.content == 'link') {
      this.world.engine.openLink(this.props.url);
    }

    console.log(this.screenId  + 'picked');
  }
  // Ok, let's the magic begin!!
  if (this.props.type == 'external') {
    this.backgroundColor = DK3D.ScreenTypes[self.props.mesh].bg || this.backgroundColro;
    this.titleCanvas = document.createElement('canvas');
    this.titleMaterial = new THREE.MeshBasicMaterial({map: new THREE.Texture(this.titleCanvas), transparent : true})
    var loader = new THREE.JSONLoader();
    loader.load(this.world.engine.screensPath + '/' + this.props.mesh + '/mesh.json', function(geometry,materials) {
      for (var mat in materials) {
        if (materials[mat].name == 'screen_title') {
          materials[mat] = self.titleMaterial;
          //console.log(materials[mat]);
        }
        if (materials[mat].name == 'screen_display') { 
          materials[mat] = self.activeMaterial;
        } else {
          console.log(materials[mat].name);
        }
      }
      var faceMaterial = new THREE.MeshFaceMaterial(materials);
      self.mesh = new THREE.Mesh(geometry, faceMaterial);
      self.mesh.position.x = self.props.attrs.pos.x;
      self.mesh.position.y = self.props.attrs.pos.y;
      self.mesh.position.z = self.props.attrs.pos.z;
      self.mesh.rotation.x = self.props.attrs.rot.x;
      self.mesh.rotation.y = self.props.attrs.rot.y;
      self.mesh.rotation.z = self.props.attrs.rot.z;
      self.mesh.scale.x = self.props.attrs.scale.x;
      self.mesh.scale.y = self.props.attrs.scale.y;
      self.mesh.scale.z = self.props.attrs.scale.z;
      self.mesh.userData = {screen : self.sceenId};
      self.world.scene.add(self.mesh);
      self.world.screenMeshes.push(self.mesh);
      self.mesh.name='screen-' + self.screenId;
      self.displayCanvas.width = DK3D.ScreenTypes[self.props.mesh].width;
      self.displayCanvas.height = DK3D.ScreenTypes[self.props.mesh].height;
      self.titleCanvas.width = DK3D.ScreenTypes[self.props.mesh].tWidth;
      self.titleCanvas.height = DK3D.ScreenTypes[self.props.mesh].tHeight;
      self.titleCanvas.getContext('2d').fillStyle='#000000';
      self.titleCanvas.getContext('2d').fillRect(0,0,256,34);
      self.titleMaterial.map.needsUpdate=true;
      self.offsetX = 0;
      self.offsetY = 0;
      self.setTitle(self.props.name);
      self.init();
    }, self.world.engine.screensPath + '/' + self.props.mesh);

    //TODO: Add title;
  } else {
    this.offsetX = parseInt(props.offset_w);
    this.offsetY = parseInt(props.offset_h);

    this.displayCanvas.width=props.width+props.offset_w;
    this.displayCanvas.height=props.height+props.offset_h;

    //find the correct texture and replace it without mercy!!!!
    //FIXME: We need to break the cycle after we find right mterial
    for (var obj in this.world.objs3d) {

      this.world.objs3d[obj].traverse(function(node) {
          console.log(node);
          if ( node.material && node.material.name === 'screen-' + self.screenId ) {
            console.log(' have the mtarial to dominate');
            node.material = self.activeMaterial;
          } else if (node.material.materials) {
              console.log('browsing for face material');
              for (var mat in node.material.materials) {
                if (node.material.materials[mat].name == 'screen-' + self.screenId) {
                  node.material.materials[mat] = self.activeMaterial;
                  node.material.materials[mat].map.needsUpdate = true;
                }
              }
          }
      },true);
    }
    self.init();
  }
}
