
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import { Water } from './water';
// @ts-ignore
import { Sky } from './sky';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js';
import { GUI } from 'dat.gui';
import { useRef, useEffect } from 'react'
let
stats = new (Stats as any),
water = new (Water as any),
sun = new THREE.Vector3(),
whale = null,
curve = new THREE.CatmullRomCurve3(),
flow = null as any;
let camera:THREE.PerspectiveCamera, scene: THREE.Scene = new THREE.Scene(), renderer: THREE.WebGLRenderer;
let controls,mesh:THREE.Mesh ;
let curveHandles:any = [];
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
function init(container:HTMLDivElement) {

   

    //WebGLRenderer

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container && container.appendChild(renderer.domElement);

    //Scene


    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(30, 30, 100);
    const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);


    // Water

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add(water);

    // Skybox

    const sky = new Sky() as any;
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180,
        rotationX: 0,
        rotationY: Math.PI,
        rotationZ: 0,
        scale: 0.5,
        translateX: 0,
        translateY:0,
        translateZ: 0,
        

    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let renderTarget:THREE.WebGLRenderTarget;

    function updateSun() {

        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene(sky);

        scene.environment = renderTarget.texture;

    }
    // create sun
    updateSun();

    

    const geometry = new THREE.BoxGeometry(30, 30, 30);
    const material = new THREE.MeshStandardMaterial({ roughness: 0 });

    mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);


    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    //

    stats = new ( Stats as any )();
    container && container.appendChild(stats.dom);

    // GUI

    const gui = new GUI();

    const folderSky = gui.addFolder('Sky');
    folderSky.add(parameters, 'elevation', 0, 90, 0.1).onChange(updateSun);
    folderSky.add(parameters, 'azimuth', - 180, 180, 0.1).onChange(updateSun);
    folderSky.open();

    const waterUniforms = water.material.uniforms;

    const folderWater = gui.addFolder('Water');
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('distortionScale');
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('size');
    folderWater.open();
    
    const folderWhale = gui.addFolder('Whale');
    gui.add( parameters, 'rotationX', -3, 3 ).step( 0.25 ).onChange( updateModel );
    gui.add( parameters, 'rotationY', -3, 3 ).step( 0.25 ).onChange( updateModel );
    gui.add( parameters, 'rotationZ', -3, 3 ).step( 0.25 ).onChange( updateModel );
    gui.add( parameters, 'scale', 0.1, 400 ).step( 0.01 ).onChange( updateModel );
    gui.add( parameters, 'translateX', -1000, 1000 ).step( 0.01 ).onChange( updateModel );
    gui.add( parameters, 'translateY', -1000, 1000 ).step( 0.01 ).onChange( updateModel );
    gui.add( parameters, 'translateZ', -1000, 1000 ).step( 0.01 ).onChange( updateModel );
    function updateModel() {
        flow.object3D.rotation.x = parameters.rotationX;
        flow.object3D.rotation.y = parameters.rotationY;
        flow.object3D.rotation.z = parameters.rotationZ;
        flow.object3D.scale.setScalar(parameters.scale)
        flow.object3D.position.set(parameters.translateX, parameters.translateY, parameters.translateZ)

    }
    folderWhale.open();
    gui.close()

    // curve
    const initialPoints = 
        [new THREE.Vector3(270.7855573168722, 11.5768653140154, -5.6054068667271935),
            new THREE.Vector3(70.85452723913048, -200.31900590487544, -3.6318365646886615),
            new THREE.Vector3(-270.2765413677177, -70.10180620668058, 120.79604394126204),
            new THREE.Vector3(-133.38801353952266, 100.24418814886636, 89.42525594078083),
            new THREE.Vector3(58.83462451300599, 162.71071391573383, 60.9117545354481)
        
    ]
    const boxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
    const boxMaterial = new THREE.MeshBasicMaterial();
    for ( const handlePos of initialPoints ) {
        const handle = new THREE.Mesh( boxGeometry, boxMaterial );
        handle.position.copy( handlePos as THREE.Vector3);
        curveHandles.push( handle );
        // scene.add( handle );
    }
    curve = new THREE.CatmullRomCurve3(
        curveHandles.map( ( handle:any ) => handle.position ),
        true,
        'centripetal',
    );
    const points = curve.getPoints( 200 );
    const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints( points ),
        new THREE.LineBasicMaterial( { color: 0x00ff00 } )
    );
    // scene.add( line );
   

}
const objLoader = new OBJLoader()
objLoader.load(
    'whale-obj/whale.obj',
    (object) => {
        var	material =  new THREE.MeshNormalMaterial( { flatShading: true } ) 
        console.log(object)
        whale  = object.children[0];
        (whale  as THREE.Mesh).material = material
        flow = new Flow(whale as THREE.Mesh);
        flow.updateCurve( 0, curve );
        scene.add( flow.object3D )
        flow.object3D.scale.setScalar( 0.4 );
        flow.object3D.position.set( 0, 0, 0 );
        flow.object3D.rotation.set( 0, Math.PI, 0 )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

function animate() {

    requestAnimationFrame(animate);
    render();
    stats.update();

}

function render() {

    const time = performance.now() * 0.001;
    if ( flow ) {
        flow.moveAlongCurve( 0.001);
    }
    // console.log(flow)
    // flow.updateCurve( time, curve );
    mesh.position.y = Math.sin(time) * 20 + 5;
    mesh.rotation.x = time * 0.5;
    mesh.rotation.z = time * 0.51;

    water.material.uniforms['time'].value += 1.0 / 60.0;

    renderer.render(scene, camera);

}
export default function Sea() {
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        containerRef.current && init(containerRef.current)
        animate()
        window.addEventListener('resize', onWindowResize);
        return () => {
            window.removeEventListener('resize', onWindowResize);
        }

    }, [])
    return (
        <div id="container" ref={containerRef} style={{width:'100%',height:'100%'}}>
        
        </div>
    )
}