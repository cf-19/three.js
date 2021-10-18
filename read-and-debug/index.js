import * as THREE from '../src/Three.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js'

class App {

    camera; 
    scene; 
    renderer;
    geometry; 
    material; 
    mesh;

    static VIEWPORT_WIDTH = 600;
    static VIEWPORT_HEIGHT = 400;

    init() {

        this.camera = new THREE.PerspectiveCamera( 70, App.VIEWPORT_WIDTH / App.VIEWPORT_HEIGHT, 0.01, 1000 );
        this.camera.position.z = 100;
        this.scene = new THREE.Scene();
    
        /** custom start */
        this.testLOD()
        /** custom end */
    
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( App.VIEWPORT_WIDTH, App.VIEWPORT_HEIGHT );
        this.renderer.setAnimationLoop( this.animation.bind(this) );
        document.body.appendChild( this.renderer.domElement );

        const controls = new OrbitControls( this.camera, this.renderer.domElement );

    }

     /**
     * @param {Number} 0 - frames
     */
    animation(time) {
        // console.log(time);
        // this.mesh.rotation.x = time / 2000;
        // this.mesh.rotation.y = time / 1000;
    
        this.renderer.render( this.scene, this.camera );
    }

    /** test shape geometry */
    testShapeGeometry() {

        const x = 0, y = 0;

        const heartShape = new THREE.Shape();

        heartShape.moveTo( x + 5, y + 5 );
        heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
        heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
        heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
        heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
        heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
        heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

        const geometry = new THREE.ShapeGeometry( heartShape );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const mesh = new THREE.Mesh( geometry, material ) ;
        this.scene.add( mesh );

    }

    testLOD() {
        const lod = new THREE.LOD();

        //Create spheres with 3 levels of detail and create new LOD levels for them
        for( let i = 0; i < 3; i++ ) {

            const geometry = new THREE.IcosahedronGeometry( 10, 3 - i )
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const mesh = new THREE.Mesh( geometry, material );

            lod.addLevel( mesh, i * 75 );

        }

        this.scene.add( lod );
    }

}

new App().init();