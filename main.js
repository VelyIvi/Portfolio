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

// icoSphere.position.x =0.7;
// icoSphere.position.y =0.4;



var clock = new THREE.Clock();


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
    console.log(t, "  ", height, "   ", window.innerHeight);
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
function animate() {
    document.body.onscroll = scrollAnimate();

    var elapsedTime = clock.getElapsedTime();


    icoSphere.material.uniforms.uTime.value = 0.5*elapsedTime;
    // icoSphere.material.uniforms.uScale.value = Math.sin(elapsedTime/3)/2+1;
    // icoSphere.material.uniforms.uChange.value = Math.sin(elapsedTime/5)/3+1/3;

    // icoSphere.material.uniforms.uPcurveHandle.value = Math.sin(elapsedTime)*4.0;


    requestAnimationFrame( animate );
    // icoSphere.rotation.x += 0.002;
    // icoSphere.rotation.y += 0.0005;
    // icoSphere.rotation.z += 0.002;

    renderer.render( scene, camera );

}

animate();