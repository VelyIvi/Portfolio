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


var torusKnot1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 0.8, 0.08,  128, 3, 4, 5),
    new THREE.MeshBasicMaterial( { color: 0xB33951, wireframe: true})
);


var torusKnot2 = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 0.3, 0.01,  64, 3, 3, 5),
    new THREE.MeshBasicMaterial( { color: 0xf5d3a3, wireframe: true})
);

var torusKnot3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 0.8, 0.05,  64, 5, 1, 3),
    new THREE.MeshBasicMaterial( { color: 0x7CA5B8, wireframe: true})
);

// scene.add(torusKnot1);
// scene.add(torusKnot2);
// scene.add(torusKnot3);

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





scene.background = new THREE.Color( 0x151D28);

////SCROLL
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight );

var windowInnerHeight = window.innerHeight;


let mouse = new THREE.Vector2();
let mousePow = new THREE.Vector2();
function scrollAnimate(){

    const t = -document.body.getBoundingClientRect().top/(height-windowInnerHeight);
    const tPow = Math.pow(t, 2);
    // console.log(t, "  ", height, "   ", window.innerHeight);
    icoSphere.material.uniforms.uChange.value = t*0.9;


    camera.position.set(-0.7 + t*1.4 + (mousePow.x)*Math.PI/128, -0.4 + t*0.8 - (mousePow.y)*Math.PI/128, 1.5);

}


function onWindowResize(){
    windowInnerHeight = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );




window.addEventListener("mousemove", (event) => {
// convert to normalized device coordinates
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    mouse.x = (event.clientX / window.innerWidth);
    mouse.y = (event.clientY / window.innerHeight);
    mousePow.x = Math.pow(mouse.x, 2) * 2 -1;
    mousePow.y = Math.pow(mouse.y, 2)*2 - 1;



    // console.log(mouse);
}, false);



var clock = new THREE.Clock();
var delta = 0;


function RotateAdd(objectR, xR, yR, zR){
    objectR.rotation.x += xR;
    objectR.rotation.y += yR;
    objectR.rotation.z += zR;
}

function animate() {
    document.body.onscroll = scrollAnimate();

    var elapsedTime = clock.getElapsedTime();
    delta = clock.getDelta();


    icoSphere.material.uniforms.uTime.value = 0.2*elapsedTime;
    // icoSphere.material.uniforms.uScale.value = Math.sin(elapsedTime/3)/2+1;
    // icoSphere.material.uniforms.uChange.value = Math.sin(elapsedTime/5)/3+1/3;

    // icoSphere.material.uniforms.uPcurveHandle.value = Math.sin(elapsedTime)*4.0;

    camera.rotation.y = (Math.pow(mouse.x, 2) * 2 -1)*Math.PI/128;
    camera.rotation.x = (Math.pow(mouse.y, 2)*2 - 1)*Math.PI/128;


    console.log(camera.rotation.x + "   " + camera.rotation.y);

    requestAnimationFrame( animate );

    RotateAdd(torusKnot1, 0.0001, 0.0001, 0.0001);
    RotateAdd(torusKnot2, -0.0001, 0.00003, -0.0002);
    RotateAdd(torusKnot3, 0.00005, -0.0001, 0.0002);


    RotateAdd(decorationCube1, 0.0005, 0.0005, 0.0005);
    RotateAdd(decorationCube2, -0.001, 0.0008, -0.0005);
    RotateAdd(decorationCube3, 0.0015, 0.0003, -0.0005);

    decorationCube1.position.y = Math.sin(elapsedTime/8)/30+0.7;
    decorationCube1.position.x = Math.sin(elapsedTime/60)/8+1.5;

    decorationCube2.position.y = Math.cos(elapsedTime*0.1)/20+0.1;
    decorationCube2.position.x = Math.sin(elapsedTime/40)/10+1.2;

    decorationCube3.position.y = Math.sin(elapsedTime*0.4+26)/25+0.3;
    decorationCube3.position.x = Math.sin(elapsedTime/90)/10+1.8;


    // console.log(sinTest);

    renderer.render( scene, camera );

}

animate();