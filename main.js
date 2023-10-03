import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// const glsl = require("glslify");


import icosphereVertexShader from './shaders/voronoi_vertex.glsl'
import icosphereFragmentShader from './shaders/voronoi_fragment.glsl'

////RENDERER

Number.prototype.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


////SCENE
const scene = new THREE.Scene();

////CAMERA
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

////ORBITAL CAMERA
// const controls = new OrbitControls( camera, renderer.domElement );

camera.position.set( 0, 0 ,3  );
// controls.update();

////LIGHTS
// const AmbientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(AmbientLight);

// const PointLight = new THREE.DirectionalLight(0xffffff, 1);
// scene.add(PointLight);
// PointLight.position.y = 10;
//
// ////HELPERS
// const LightHelper = new THREE.DirectionalLightHelper( PointLight, 5 );
// scene.add( LightHelper );

const GridHelper = new THREE.GridHelper(20, 20);
// scene.add(GridHelper);


var uTimeAnimated = 0.0;

const  icoSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 128),
    new THREE.ShaderMaterial({
        vertexShader: icosphereVertexShader,
        fragmentShader: icosphereFragmentShader,
        uniforms: {
            uTime: {value: uTimeAnimated},
            uScale: {value: 1},
            uResolution: new THREE.Uniform( new THREE.Vector2(10, 10)),
            uChange: {value: 0.0},
        }
    })
);

scene.add(icoSphere);


var clock = new THREE.Clock();


var deltaMouse = (0.0, 0.0);

scene.background = new THREE.Color( 0x111818);

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );
function animate() {
    var elapsedTime = clock.getElapsedTime();


    icoSphere.material.uniforms.uTime.value = 2*elapsedTime;
    // icoSphere.material.uniforms.uScale.value = Math.sin(elapsedTime)/2+1;
    // icoSphere.material.uniforms.uChange.value = Math.sin(elapsedTime)/3+1/3;

    // icoSphere.material.uniforms.uPcurveHandle.value = Math.sin(elapsedTime)*4.0;


    requestAnimationFrame( animate );
    icoSphere.rotation.x += 0.005;
    icoSphere.rotation.y += 0.005;
    icoSphere.rotation.z += 0.001;



    // required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update();

    renderer.render( scene, camera );

}

animate();