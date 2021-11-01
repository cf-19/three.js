import * as THREE from '../src/Three.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js'

class App {

    camera = new THREE.PerspectiveCamera( 70, App.VIEWPORT_WIDTH / App.VIEWPORT_HEIGHT, 0.01, 1000 ); 
    scene = new THREE.Scene(); 
    renderer;
    geometry; 
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
    mesh;

    static VIEWPORT_WIDTH = 600;
    static VIEWPORT_HEIGHT = 400;

    init() {

        this.camera.position.z = 50;
        this.camera = new THREE.PerspectiveCamera( 60, App.VIEWPORT_WIDTH / App.VIEWPORT_HEIGHT, 0.01, 1000 );
        this.camera.position.z = 0;
        this.scene = new THREE.Scene();

        const size = 10;
        const divisions = 10;

        const gridHelper = new THREE.GridHelper( size, divisions );
        this.scene.add( gridHelper );
    
        /** custom start */
        this.testMirrorMatrix()
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

        return mesh;

    }

    testMirrorMatrix() {

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
        mesh.position.set(75, 0, -300);

        // rotate
        mesh.rotation.z = 3.14 / 4

        let meshs = [mesh]
        console.log("origin mesh", mesh);

        let zNormal = new THREE.Vector3(0, 0, 1);

        // rotate along with y plane
        {
            let meshClone = mesh.clone();
            let plane = new Plane()
            plane.fromTriangle(
                new THREE.Vector3(0, 0, 0),
                zNormal,
                new THREE.Vector3(0, 1, 0),
            );
            meshClone.applyMatrix4(plane.getReflection())
            meshs.push(meshClone)
            console.log("Y plane", meshClone);
        }

        {
            let meshClone = mesh.clone();
            let plane = new Plane()
            plane.fromTriangle(
                new THREE.Vector3(0, 0, 0),
                zNormal,
                new THREE.Vector3(1, 1, 0).normalize(),
            );
            meshClone.applyMatrix4(plane.getReflection())
            meshs.push(meshClone)
            console.log("custom", meshClone);
        }
        

        this.scene.add( ...meshs );

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

    testMeshUserData() {
        this.scene.userData = {
            test: "I'm data"
        }
        console.log(this.scene.toJSON());
    }

    testLineSegment() {

        // 奇数的情况 最后一点顶点无效
        const points = [];
        points.push( new THREE.Vector3( 10, 0, 0 ) );
        points.push( new THREE.Vector3( 10, 10, 0 ) );
        points.push( new THREE.Vector3( 0, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 10, 0 ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const LineSegments = new THREE.LineSegments( geometry, this.material );

        this.scene.add(LineSegments);

    }

}

class M_Matrix {

    static getReflection({a,b,c,d}) {

        let mirrorMatrix = new THREE.Matrix4();
        mirrorMatrix.set(
            1-2*a*a, -2*a*b, -2*a*c, -2*a*d,
            -2*a*b, 1-2*b*b, -2*b*c, -2*b*d,
            -2*a*c, -2*b*c, 1-2*c*c, -2*c*d,
            0, 0, 0, 1,
        );

        return mat;

    }

}

class Plane {

    norm;
    d;

    fromTriangle(v0, v1, v2) {

        this.norm = new THREE.Vector3().crossVectors( v1.sub(v0), v2.sub(v0) );
        this.d = -this.norm.dot(v0);

    }

    getReflection() {

        let norm = this.norm
        let d = this.d

        let mirrorMatrix = new THREE.Matrix4();
        mirrorMatrix.set(
            -2 * norm.x * norm.x + 1,  -2 * norm.y * norm.x,     -2 * norm.z * norm.x, 0,
            -2 * norm.x * norm.y,      -2 * norm.y * norm.y + 1, -2 * norm.z * norm.y, 0,
            -2 * norm.x * norm.z,      -2 * norm.y * norm.z,     -2 * norm.z * norm.z + 1, 0,
            -2 * norm.x * d, -2 * norm.y * d, -2 * norm.z * d, 1,
        );

        return mirrorMatrix;

    }

}

new App().init();