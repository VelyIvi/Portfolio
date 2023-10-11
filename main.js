import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


// const glsl = require("glslify");


import icosphereVertexShader from './shaders/voronoi_vertex.glsl'
import icosphereFragmentShader from './shaders/voronoi_fragment.glsl'

// import textVertexShader from './shaders/text_vertex.glsl'
// import textFragmentShader from './shaders/text_fragment.glsl'
import {Vector3} from "three";


////RENDERER
var camera, scene, renderer;
function init() {
    Number.prototype.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);


    ////SCENE
    scene = new THREE.Scene();

    ////CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    ////ORBITAL CAMERA
    // const controls = new OrbitControls( camera, renderer.domElement );

    camera.position.set(-0.7, -0.4, 1.5);
    // controls.update();
}


init();

var icoSphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 32),
    new THREE.ShaderMaterial({
        vertexShader: icosphereVertexShader,
        fragmentShader: icosphereFragmentShader,
        wireframe: true,
        uniforms: {
            uTime: {value: 0.0},
            uScale: {value: 1.5},
            uResolution: new THREE.Uniform( new THREE.Vector2(10, 10)),
            uChange: {value: 0.0},
        }
    })
);

scene.add(icoSphere);


var torusKnotGreen = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 0.4, 0.001,  64, 128, 3, 2),
    new THREE.MeshBasicMaterial( { color: 0x6E0D25})
);


var torusKnotBlue = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 0.5, 0.001,  64, 128, 3, 5),
    new THREE.MeshBasicMaterial( { color: 0x9E768F})
);

scene.add(torusKnotGreen);
scene.add(torusKnotBlue);

var decorationCube1 = new THREE.Mesh(
    new THREE.BoxGeometry( 0.3,0.3, 0.3),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true})
);
decorationCube1.position.z = -0.5;
scene.add(decorationCube1);

var decorationCube2 = new THREE.Mesh(
    new THREE.BoxGeometry( 0.2,0.2, 0.2),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true})
);
decorationCube2.position.z = -0.1;
scene.add(decorationCube2);

var decorationCube3 = new THREE.Mesh(
    new THREE.BoxGeometry( 0.15,0.15, 0.15),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true})
);
decorationCube3.position.z = -0.3;
scene.add(decorationCube3);


// icoSphere.position.x =0.7;
// icoSphere.position.y =0.4;





var deltaMouse = (0.0, 0.0);

scene.background = new THREE.Color( 0x151D28);

////SCROLL
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight );

var windowInnerHeight = window.innerHeight;

function scrollAnimate(){

    const t = -document.body.getBoundingClientRect().top/(height-windowInnerHeight);
    const tPow = Math.pow(t, 2);
    // console.log(t, "  ", height, "   ", window.innerHeight);
    icoSphere.material.uniforms.uChange.value = t*0.9;

    camera.position.set(-0.7 + t*1.4, -0.4 + t*0.8, 1.5);

}


function onWindowResize(){
    windowInnerHeight = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );



var clock = new THREE.Clock();
var delta = 0;

function animate() {
    document.body.onscroll = scrollAnimate();

    var elapsedTime = clock.getElapsedTime();
    delta = clock.getDelta();


    icoSphere.material.uniforms.uTime.value = 0.5*elapsedTime;
    // icoSphere.material.uniforms.uScale.value = Math.sin(elapsedTime/3)/2+1;
    // icoSphere.material.uniforms.uChange.value = Math.sin(elapsedTime/5)/3+1/3;

    // icoSphere.material.uniforms.uPcurveHandle.value = Math.sin(elapsedTime)*4.0;


    requestAnimationFrame( animate );
    torusKnotGreen.rotation.x += 0.0005;
    torusKnotGreen.rotation.y += 0.0005;
    torusKnotGreen.rotation.z += 0.0005;

    torusKnotBlue.rotation.x -= 0.0005;
    torusKnotBlue.rotation.y += 0.0005;
    torusKnotBlue.rotation.z -= 0.0008;


    decorationCube1.rotation.x += 0.001;
    decorationCube1.rotation.y += 0.001;
    decorationCube1.rotation.z += 0.001;

    decorationCube2.rotation.x -= 0.002;
    decorationCube2.rotation.y += 0.0015;
    decorationCube2.rotation.z -= 0.001;

    decorationCube3.rotation.x += 0.003;
    decorationCube3.rotation.y += 0.0005;
    decorationCube3.rotation.z -= 0.001;

    decorationCube1.position.y = Math.sin(elapsedTime/2)/10+0.9;
    decorationCube1.position.x = Math.sin(elapsedTime/20)/8+1.5;

    decorationCube2.position.y = Math.cos(elapsedTime*1.3)/20+0.3;
    decorationCube2.position.x = Math.sin(elapsedTime/10)/10+1.2;

    decorationCube3.position.y = Math.sin(elapsedTime*1.8+26)/25+0.5;
    decorationCube3.position.x = Math.sin(elapsedTime/30)/10+1.8;


    // console.log(sinTest);

    renderer.render( scene, camera );

}

animate();