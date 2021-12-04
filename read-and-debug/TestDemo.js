import * as THREE from '../src/Three.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js'

class Plane {

    norm;
    d;

    fromTriangle(v0, v1, v2) {

        this.norm = new THREE.Vector3().crossVectors( 
            v1.sub(v0), 
            v2.sub(v0) );
    
        this.norm.normalize()

        this.d = -this.norm.dot(v0);

    }

    getReflection() {

        let norm = this.norm
        let d = this.d

        let mirrorMatrix = new THREE.Matrix4();

        // matrix follow row order
        // m00, m01, m02, m03
        // m10, m11, m12, m13

        mirrorMatrix.set(
            -2 * norm.x * norm.x + 1,  -2 * norm.x * norm.y,     -2 * norm.x * norm.z,     -2 * norm.x * d,
            -2 * norm.y * norm.x,      -2 * norm.y * norm.y + 1, -2 * norm.y * norm.z,     -2 * norm.y * d,
            -2 * norm.z * norm.x,      -2 * norm.z * norm.y,     -2 * norm.z * norm.z + 1, -2 * norm.z * d,
            0,           0,          0,          1,
        );

        return mirrorMatrix;

    }

}

class App {

    camera = new THREE.PerspectiveCamera( 70, App.VIEWPORT_WIDTH / App.VIEWPORT_HEIGHT, 0.01, 1000 ); 
    scene = new THREE.Scene(); 
    renderer;
    geometry; 
    material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
    mesh;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    static VIEWPORT_WIDTH = 600;
    static VIEWPORT_HEIGHT = 400;

    init() {
        this.camera.position.z = 50;
        this.camera = new THREE.PerspectiveCamera( 60, App.VIEWPORT_WIDTH / App.VIEWPORT_HEIGHT, 0.01, 1000 );
        this.camera.position.z = 100;
        this.scene = new THREE.Scene();

        const size = 10;
        const divisions = 10;

        // const gridHelper = new THREE.GridHelper( size, divisions );
        // this.scene.add( gridHelper );
    
        /** custom start */
        this.testModelMatrix()
        /** custom end */
    
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( App.VIEWPORT_WIDTH, App.VIEWPORT_HEIGHT );
        this.renderer.setAnimationLoop( this.animation.bind(this) );
        document.body.appendChild( this.renderer.domElement );
        document.addEventListener("mousedown", this.onMouseDown.bind(this));

        const points = [];
        points.push( new THREE.Vector3( 0, 0, 0 ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.PointsMaterial( { color: 0xFFFF33, size: 5 } );
        const p = new THREE.Points( geometry, material );
        this.scene.add(p)

        // const controls = new OrbitControls( this.camera, this.renderer.domElement );
    }

    testBox2() {
        const box = new THREE.Box2().setFromPoints([
            new THREE.Vector2(100, 100),
            new THREE.Vector2(0, 0),
        ])
    }

    onMouseDown(event) {
        this.mouse.x =  ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y =  -( event.clientY / window.innerHeight ) * 2 + 1;

        console.log(this.mouse);

        this.raycaster.setFromCamera( this.mouse, this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );

        console.log(intersects);

        for ( let i = 0; i < intersects.length; i ++ ) {

            console.log(intersects[i]);
    
        }
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

    get3dPointZAxis(event) {
        var vector = new THREE.Vector3(
                    ( event.clientX / window.innerWidth ) * 2 - 1,
                    - ( event.clientY / window.innerHeight ) * 2 + 1,
                    0.5 );
        vector.unproject( this.camera );

        var dir = vector.sub( this.camera.position ).normalize();
        var distance = - (this.camera.position.z) / dir.z;
        var pos = this.camera.position
            .clone()
            .add( dir.multiplyScalar( distance ) );    

        return pos;
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
        const material = new THREE.MeshBasicMaterial( { 
            color: 0x00ff00,  
            side: THREE.DoubleSide
        } );
        const mesh = new THREE.Mesh( geometry, material ) ;

        return mesh;
    }

    testRotate() {
        const mesh = this.testShapeGeometry()
        mesh.position.set(75, 0, -300);

        // 45d, z为positive时, 是逆时针
        // mesh.rotation.z = Math.PI / 2
        console.log(mesh);

        this.scene.add(mesh)
    }

    testMirrorMatrix() {
        const mesh = this.testShapeGeometry()
        mesh.position.set(75, 0, -300);

        let meshs = [mesh]
        console.log("origin mesh", mesh.position);

        // rotate along with y plane
        {
            let meshClone = mesh.clone();
            let plane = new Plane()
            plane.fromTriangle(
                new THREE.Vector3(75, -75, 0),
                new THREE.Vector3(0, -75, 0),
                new THREE.Vector3(75, -75, 1),
            );
            meshClone.applyMatrix4(plane.getReflection())
            meshs.push(meshClone)
            console.log("Y plane", meshClone.position);
        }

        {
            let meshClone = mesh.clone();
            let plane = new Plane()
            plane.fromTriangle(
                new THREE.Vector3(-10, 30, 0),
                new THREE.Vector3(-3, 2, 0),
                new THREE.Vector3(-10, 30, 1),
            );
            meshClone.applyMatrix4(plane.getReflection())
            meshs.push(meshClone)
            console.log("custom", meshClone.position);
        }

        // {
        //     let clone = mesh.clone()
        //     clone.position.set(-571180.9066396414, 588493.3844786487, -300)
        //     let plane = new Plane()
        //     plane.fromTriangle(
        //         new THREE.Vector3( -573139.23, 590225.41, 0 ),
        //         new THREE.Vector3( -570916.7, 591801.39, 0),
        //         new THREE.Vector3( -573139.23, 590225.41, 1)
        //     );
        //     let m = plane.getReflection();
        //     clone.applyMatrix4(m);
        //     console.log("test pos", clone.position);
        //     meshs.push(clone);
        // }

        this.scene.add( ...meshs );
    }

    /**
     * LOD
     */
    testLOD() {
        const lod = new THREE.LOD();

        // Create spheres with 3 levels of detail and create new LOD levels for them
        for( let i = 0; i < 3; i++ ) {
            const geometry = new THREE.IcosahedronGeometry( 10, 3 - i )
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const mesh = new THREE.Mesh( geometry, material );

            lod.addLevel( mesh, i * 75 );
        }

        this.scene.add( lod );
    }

    /**
     * check if toJSON save userdata
     */
    testMeshUserData() {
        this.scene.userData = {
            test: "I'm data"
        }
        console.log(this.scene.toJSON());
    }

    /**
     * 奇数的情况 最后一点顶点无效
     * line segment线段为偶数
     */
    testLineSegment() {
        const points = [];
        points.push( new THREE.Vector3( 10, 0, 0 ) );
        points.push( new THREE.Vector3( 10, 10, 0 ) );
        points.push( new THREE.Vector3( 0, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 10, 0 ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const LineSegments = new THREE.LineSegments( geometry, this.material );

        this.scene.add(LineSegments);
    }

    /**
     * 测试相对坐标
     */
    testRelativePos() {
        const m = new THREE.Group();
        m.position.set(40, 0, 0);

        const child = new THREE.Group().add(this.testShapeGeometry());

        child.position.set(40, 0, 0);
        m.add(child)

        console.log(m);
        this.scene.add(m)
    }

    /**
     * test layer func bitmask
     */
    testLayer() {
        const cameraLayer = new Layers();
        const objLayer = new Layers();
        
        objLayer.set(30)
        
        // 
        cameraLayer.enable(1)
        cameraLayer.enable(2)
        cameraLayer.enable(30)
        console.log(cameraLayer);
        console.log(objLayer);
        
        console.log(objLayer.test(cameraLayer));
    }

    /**
     * 测试model matrix
     */
    testModelMatrix() {
        const g = new THREE.Group()
        g.position.set(0, 0, 0)
        // g.position.set(10, 10, 0)
        g.rotation.z = Math.PI /2

        const points = [];
        points.push( new THREE.Vector3( 10, 10, 0 ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.PointsMaterial( { color: 0xFFFFFF, size: 5 } );
        const p = new THREE.Points( geometry, material );
        
        g.add(p)
        this.scene.add(g, p.clone)

        for (const k in p) {
            // console.log(k, line[k])
        }
        
        /**
         * 1. matrix matrixWorld diff?
         *      - matrix: local matrix
         *      - matrixWorld: world matrix
         */
        console.log("matrixWorld", g.matrixWorld);
        console.log("matrixWorld", p.matrixWorld);

        // 
        const pos = g.position.clone();
        const scale = g.scale.clone();
        const quaternion = g.quaternion.clone();
        const matrixWorl = new THREE.Matrix4().compose(pos, quaternion, scale)
        console.log(matrixWorl)

        // 可以作为解块的处理方法, 原始的点数据applyBlockGroup下的矩阵
        console.log("applyMatrixWorld", new THREE.Vector3(10, 10, 0).applyMatrix4(matrixWorl));
        
        /**
         * 2. getWorldPosition() 获取world space下的position属性，并非shader model后的数据
         */
        // const getWorldPosition = p.getWorldPosition();
        // console.log("getWorldPosition", getWorldPosition);
    }

    /**
     * 
     */
    testMatrixOrder() {
        // 存的时候是 CR ORDER
            //   [ 11, 21, 31, 41,
            //     12, 22, 32, 42,
            //     13, 23, 33, 43,
            //     14, 24, 34, 44 ];
    }

}

new App().init();