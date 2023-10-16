import * as THREE from 'three';

import icosphereVertexShader from './shaders/voronoi_vertex.glsl'
import icosphereFragmentShader from './shaders/voronoi_fragment.glsl'


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
    camera.position.set(-0.7, -0.4, 1.5);
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

scene.background = new THREE.Color( 0x151D28);

////DOCUMENT INTERACTION
var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight );

var windowInnerHeight = window.innerHeight;

window.addEventListener( 'resize', (event) => {
    windowInnerHeight = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false);

function powerDispersed(value){
    return (4 * Math.pow((value-0.5), 3));
}
window.addEventListener("mousemove", (event) => { // convert to normalized device coordinates
    mouse.set((event.clientX / window.innerWidth), (event.clientY / window.innerHeight));
}, false);

addEventListener("scroll", (event) => {
    const t = -document.body.getBoundingClientRect().top/(height-windowInnerHeight);
    cameraScrollEffect = t;

    cameraScrollPosition.set(-0.7 + t*1.4, -0.4 + t*0.8, 1.5);

}, false);


function RotateAdd(objectR, xR, yR, zR){
    objectR.rotation.x += xR * delta;
    objectR.rotation.y += yR * delta;
    objectR.rotation.z += zR * delta;
}


const  cameraScrollSmoothness = 1/2;
var cameraScrollPosition = new THREE.Vector3(-0.7, -0.4, 1.5);
var cameraScrollMove = new THREE.Vector3(0, 0, 0);

var cameraScrollEffect = 0;
var cameraScrollEffectMove = 0;

let mouse = new THREE.Vector2();
var mouseMove = new THREE.Vector2(0, 0);

const clock = new THREE.Clock();
var oldTime = 0;
var delta = 0;
var elapsedTime = 0;

function animate() {

    elapsedTime = clock.getElapsedTime();
    delta = elapsedTime - oldTime;

    icoSphere.material.uniforms.uTime.value = 0.2*elapsedTime;

    mouseMove = new THREE.Vector2(mouseMove.x + (mouse.x - mouseMove.x)*delta/3, mouseMove.y + (mouse.y - mouseMove.y)*delta/3);


    cameraScrollMove = new THREE.Vector2(cameraScrollMove.x + (cameraScrollPosition.x - cameraScrollMove.x)*delta/cameraScrollSmoothness, cameraScrollMove.y + (cameraScrollPosition.y - cameraScrollMove.y)*delta/cameraScrollSmoothness);

    camera.position.set(cameraScrollMove.x - (mouseMove.x*2 -1)/4, cameraScrollMove.y + (mouseMove.y*2 -1)/4, cameraScrollPosition.z);

    camera.rotation.y = (-mouseMove.x)*Math.PI/32;
    camera.rotation.x = (-mouseMove.y)*Math.PI/32;

    cameraScrollEffectMove = cameraScrollEffectMove + (cameraScrollEffect - cameraScrollEffectMove)*delta/(1/2);
    icoSphere.material.uniforms.uChange.value = cameraScrollEffectMove*0.9;


    requestAnimationFrame( animate );


    RotateAdd(decorationCube1, 0.05, 0.05, 0.05);
    RotateAdd(decorationCube2, -0.01, 0.08, -0.05);
    RotateAdd(decorationCube3, 0.015, 0.03, -0.05);

    decorationCube1.position.y = Math.sin(elapsedTime/8)/30+0.5;
    decorationCube1.position.x = Math.sin(elapsedTime/60)/8+1.5;

    decorationCube2.position.y = Math.cos(elapsedTime*0.1)/20-0.1;
    decorationCube2.position.x = Math.sin(elapsedTime/40)/10+1.2;

    decorationCube3.position.y = Math.sin(elapsedTime*0.4+26)/25+0.1;
    decorationCube3.position.x = Math.sin(elapsedTime/90)/10+1.8;

    icoSphere.position.y = Math.sin(elapsedTime*0.2)/30;
    icoSphere.position.x = Math.sin(elapsedTime/20)/80;

    renderer.render( scene, camera );

    oldTime = elapsedTime;

}

animate();