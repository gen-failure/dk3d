PC3D = {
    loadObject : function(objFlag) {

        var ajaxRoot = 'data/scenes/' + world.code + '/models/' + objFlag;
        var loader = new THREE.JSONLoader();
        var props;

        microAjax(ajaxRoot + '/' + 'props.json', function(res) {
            props = JSON.parse(res);
        });
        var modelUrl = ajaxRoot + '/' + objFlag + '.json';
        console.log("Model URL is : " + modelUrl);
        loader.load(modelUrl, function (geometry, materials) {
            var faceMaterial = new THREE.MeshFaceMaterial(materials);
            var mesh = new THREE.Mesh(geometry, faceMaterial);
            mesh.scale.set(props.scale_x, props.scale_y, props.scale_z);
            mesh.traverse( function( node ) {
              if( node.material ) {
                node.material.side = THREE.DoubleSide;
              }
            });
            world.scene.add(mesh);
            if (props.physical) {
              PC3D.makePhysical(mesh,props);
            }
        },ajaxRoot);
    },
    makePhysical : function(node,props) {
        console.log("Physical called for obj3d id" + node.id);
        if (typeof(props.weight) !== 'number') {
             props.weight = 0;
        }
        var ok = true;
        console.log('node ID has ' + node.children.length + 'children');
        for (var i = 0; i < node.children.length;i++) {
          var childNode = node.children[i];
          if (childNode instanceof THREE.Mesh || childNode instanceof THREE.Object3d) {
            ok = false;
          }
          PC3d.makePhysical(childNode,props);
        }
        if (ok && node instanceof THREE.Mesh) {
          var bbMesh = new Physijs.ConvexMesh(node.geometry,world.bbMaterial,0);
          bbMesh.scale.set(props.scale_x, props.scale_y, props.scale_z);
          world.scene.add(bbMesh);
        }
    }
};
