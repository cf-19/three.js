import * as THREE from '../src/Three.js';

class App {

    camera; scene; renderer;
    geometry; material; mesh;

    static VIEWPORT_WIDTH = 600;
    static VIEWPORT_HEIGHT = 400;

    init() {
        this.camera = new THREE.PerspectiveCamera( 70, App.VIEWPORT_WIDTH / App.VIEWPORT_HEIGHT, 0.01, 10 );
        this.camera.position.z = 1;
    
        this.scene = new THREE.Scene();
    
        this.geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        this.material = new THREE.MeshNormalMaterial();
    
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( App.VIEWPORT_WIDTH, App.VIEWPORT_HEIGHT );
        this.renderer.setAnimationLoop( this.animation.bind(this) );
        document.body.appendChild( this.renderer.domElement );
    }

    /**
     * 
     * @param {Number} time each frame take time?
     */
    animation(time) {
        // console.log(time);
        this.mesh.rotation.x = time / 2000;
        this.mesh.rotation.y = time / 1000;
    
        this.renderer.render( this.scene, this.camera );
    }

}

new App().init();