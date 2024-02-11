import * as THREE from 'three';

import icosphereVertexShader from "./shaders/voronoi_vertex.glsl.js";
import icosphereFragmentShader from "./shaders/voronoi_fragment.glsl.js";

////RENDERER
var camera, scene, renderer;

var DarkColor = "0B0A0A";
var MainColor = "FBB13C";
var ShadeColor = "AA0E47";
var LightColor = "FDF0D5";


function hexToRgb(hex) {
    hex = "0x" + hex;
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}

function hexToVector(hex) {
    hex = "0x" + hex;
    var bigint = parseInt(hex, 16);
    var r = ((bigint >> 16) & 255) / 255;
    var g = ((bigint >> 8) & 255) / 255;
    var b = (bigint & 255) / 255;

    return new THREE.Vector3(r, g, b);
}

function vectorToRgb(vector){
    return new THREE.Vector3(Math.round(vector.x*255), Math.round(vector.y*255), Math.round(vector.z*255))
}
function rgbToString(rgb){
    return "rgb(" + rgb.x + ", " + rgb.y + ", " + rgb.z + ")";
}


var hexNumbers = "0123456789ABCDEF".split('');
function randomHexColor (){
    var outColor = "";
    for (let i = 0; i <= 8; i++){
        outColor += (hexNumbers[Math.floor(Math.random()*hexNumbers.length)]);
    }
    return outColor;
}
function randomVectorColor (){
    return new THREE.Vector3(Math.random(), Math.random(), Math.random());
}


function init() {
    // Number.prototype.clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg'),
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);


    ////SCENE

    ////CAMERA
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    const t = -document.body.getBoundingClientRect().top/(height-windowInnerHeight);
    // console.log(t);
    cameraScrollEffect = t;
    cameraScrollPosition.set(-0.4 + t*1.0, -0.1 + t*0.5, 1.5);
}


scene = new THREE.Scene();

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
            mainColor: new THREE.Uniform(hexToVector(MainColor)),
            shadeColor: new THREE.Uniform(hexToVector(ShadeColor)),

        }
    })
);


var decorationCube1 = new THREE.Mesh(
    new THREE.BoxGeometry( 0.3,0.3, 0.3),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true})
);
decorationCube1.position.z = -0.5;

var decorationCube2 = new THREE.Mesh(
    new THREE.BoxGeometry( 0.2,0.2, 0.2),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true})
);
decorationCube2.position.z = -0.1;

var decorationCube3 = new THREE.Mesh(
    new THREE.BoxGeometry( 0.15,0.15, 0.15),
    new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true})
);
decorationCube3.position.z = -0.3;

scene.background = new THREE.Color("rgb("+ hexToRgb(DarkColor)+ ")");

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

window.addEventListener("mousemove", (event) => { // convert to normalized device coordinates
    mouse.set((event.clientX / window.innerWidth), (event.clientY / window.innerHeight));
}, false);

addEventListener("scroll", (event) => {
    const t = -document.body.getBoundingClientRect().top/(height-windowInnerHeight);
    // console.log(t);
    cameraScrollEffect = t;
    cameraScrollPosition.set(-0.4 + t*1.0, -0.1 + t*0.5, 1.5);

}, false);

function timeRotateAdd(objectR, xR, yR, zR){
    objectR.rotation.x += xR * delta;
    objectR.rotation.y += yR * delta;
    objectR.rotation.z += zR * delta;
}

const  cameraScrollSmoothness = 1/2;
var cameraScrollPosition = new THREE.Vector3(0, 0, 0);
var cameraScrollMove = new THREE.Vector3(0, 0, 1.5);

var cameraScrollEffect = 0;
var cameraScrollEffectMove = 0;

let mouse = new THREE.Vector2();
var mouseMove = new THREE.Vector2();

const clock = new THREE.Clock();
var oldTime = 0;
var delta = 0;
var elapsedTime = 0;
var virtualElapsedTime= 0;

function colorChangeButtonEvent() {
    mainColorDirection = randomVectorColor();
    colorChangeTimerCurrent = 0;
}


var mainColorCurrent = randomVectorColor();
var mainColorDirection = hexToVector(MainColor);
var mainColorSpeed = 1;

function lerp( a, b, alpha ) {
    return a + alpha * ( b - a )
}

function timeLerp(a, b, speed){
    return lerp(a, b, delta/speed);
}

function timeLerpVector2(a, b, speed){
    return new THREE.Vector2(lerp(a.x, b.x, delta/speed), lerp(a.y, b.y, delta/speed));
}

var colorChangeTimerMax = 40;
var colorChangeTimerCurrent = 0;

const colorChangeButton = document.getElementById("colorChangeButton");
colorChangeButton.addEventListener('click', colorChangeButtonEvent);

const frontTitle = document.getElementById("frontName");

// const passionText = document.getElementById("passionText");


function clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
}
function timeLerpVectorColor(colorStart, colorEnd, speed){
    const colorDelta = clamp(speed*delta, 0, 1);
    return new THREE.Vector3(lerp(colorStart.x, colorEnd.x, colorDelta),
        lerp(colorStart.y, colorEnd.y, colorDelta),
        lerp(colorStart.z, colorEnd.z, colorDelta));
}

init();

function randFloatSpread(value){
    return ((Math.random()-0.5)*value);
}



function quadraticRandFloatSpread(value){
    const randomValue = (Math.random()*2-1);

    return ((Math.pow(randomValue, 2)/2)*value*Math.sign(randomValue));
}

function randFloatRange(min, max) {
    const range = max - min;
    return (Math.random() * range + min);
}

var stars = new Array(0);
// for ( var i = 0; i < 1000; i ++ ) {
//     let x = randFloatSpread(1000);
//     let y = randFloatSpread(  500);
//     let z = randFloatRange( -1000, -100);
//     stars.push(x, y, z);
// }
for ( var i = 0; i < 5000; i ++ ) { //i < 3000
    let x = randFloatSpread(1000);
    let y = randFloatSpread(  1000);
    let z = randFloatSpread(  1000);
    stars.push(x, y, z);
}
var starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute(
    "position", new THREE.Float32BufferAttribute(stars, 3)
);
var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );
var starField = new THREE.Points(starsGeometry, starsMaterial);



////Checkboxes

var DecorationCheck = document.getElementById("decorationCheck");
var MouseCheck = document.getElementById("mouseCheck");
var ScrollCheck = document.getElementById("scrollCheck");
var AnimationCheck = document.getElementById("animationCheck");
var StarCheck = document.getElementById("starCheck");
var IcoCheck = document.getElementById("icoCheck");


var starsActive = StarCheck.checked;
var decorationsActive = DecorationCheck.checked;
var icoActive = IcoCheck.checked;



const fpsDisplay = document.getElementById("fpsDisplay");


if (starsActive){
    scene.add(starField);
}
if (decorationsActive){
    scene.add(decorationCube1);
    scene.add(decorationCube2);
    scene.add(decorationCube3);
}
if (icoActive){
    scene.add(icoSphere);
}






function checkboxes() {
    if (DecorationCheck.checked){
        if (!decorationsActive){
            decorationsActive = true;
                scene.add(decorationCube1);
                scene.add(decorationCube2);
                scene.add(decorationCube3);
        }
    } else {
        if (decorationsActive){
            decorationsActive = false;
                scene.remove(decorationCube1);
                scene.remove(decorationCube2);
                scene.remove(decorationCube3);
        }
    }
    if (MouseCheck.checked){
        mouseMove = timeLerpVector2(mouseMove, mouse, 3);
    } else {
        mouseMove.set(0.5,0.5);
    }

    if (ScrollCheck.checked){
        cameraScrollMove = timeLerpVector2(cameraScrollMove, cameraScrollPosition, cameraScrollSmoothness);
    } else {
        cameraScrollMove.set(-0.4, -0.1, 1.5);
    }
    if (StarCheck.checked){
        if (!starsActive){
            starsActive = true;
            scene.add(starField);

        }
    } else {
        if (starsActive){
            starsActive = false;
            scene.remove(starField);
        }
    }
    if (IcoCheck.checked){
        if (!icoActive){
            icoActive = true;
            scene.add(icoSphere);

        }
    } else {
        if (icoActive){
            icoActive = false;
            scene.remove(icoSphere);
        }
    }
}



const fpsUpdateMax = 0.5;
var fpsUpdate = 0;
function animate() {
    elapsedTime = clock.getElapsedTime();

    delta = clamp(elapsedTime - oldTime, 0, 1);

    fpsUpdate += elapsedTime - oldTime;

    checkboxes();
    if(fpsUpdate>= fpsUpdateMax){
        fpsDisplay.innerHTML = "FPS: " + Math.round(1/(elapsedTime - oldTime));
        fpsUpdate = 0;
    }

    // console.log(icoSphere.geometry);
    virtualElapsedTime += delta;
    frontTitle.style.background =
        "-webkit-linear-gradient(left top, " +  rgbToString(vectorToRgb(mainColorCurrent)) +", #" + ShadeColor +")";
    frontTitle.style.webkitBackgroundClip = "text";
    frontTitle.style.webkitTextFillColor = "transparent";

    colorChangeButton.style.color = rgbToString(vectorToRgb(mainColorCurrent));


    // passionText.style.background =
    //     "-webkit-linear-gradient(45deg, " +  rgbToString(vectorToRgb(mainColorCurrent)) +", #" + ShadeColor +")";
    // passionText.style.webkitBackgroundClip = "text";
    // passionText.style.webkitTextFillColor = "transparent";

    if (colorChangeTimerCurrent >= colorChangeTimerMax){
        mainColorDirection = randomVectorColor();
        colorChangeTimerCurrent = 0;
    } else {
        colorChangeTimerCurrent += delta;
    }
    mainColorCurrent = timeLerpVectorColor(mainColorCurrent, mainColorDirection, mainColorSpeed);
    icoSphere.material.uniforms.mainColor.value = mainColorCurrent;

    // console.log(mainColorDirection);
    // console.log(mainColorCurrent);


    camera.position.set(cameraScrollMove.x - (mouseMove.x*2 -1)/4, cameraScrollMove.y + (mouseMove.y*2 -1)/4, cameraScrollPosition.z);
    // console.log(virtualElapsedTime);

    timeRotateAdd(starField, 0.004, 0.005, -0.002);
    // timeRotateAdd(starField, 1, 1, -1);


    icoSphere.material.uniforms.uTime.value = 0.5*virtualElapsedTime;

    camera.rotation.y = (-mouseMove.x)*Math.PI/64;
    camera.rotation.x = (-mouseMove.y)*Math.PI/64;

    cameraScrollEffectMove = timeLerp(cameraScrollEffectMove, cameraScrollEffect, (1/2));

    icoSphere.material.uniforms.uChange.value = cameraScrollEffectMove * 0.9;

    timeRotateAdd(decorationCube1, 0.05, 0.05, 0.05);
    timeRotateAdd(decorationCube2, -0.01, 0.08, -0.05);
    timeRotateAdd(decorationCube3, 0.015, 0.03, -0.05);

    decorationCube1.position.y = Math.sin(virtualElapsedTime/8)/30+0.5;
    decorationCube1.position.x = Math.sin(virtualElapsedTime/60)/8+1.5;

    decorationCube2.position.y = Math.cos(virtualElapsedTime*0.1)/20-0.1;
    decorationCube2.position.x = Math.sin(virtualElapsedTime/40)/10+1.2;

    decorationCube3.position.y = Math.sin(virtualElapsedTime*0.4+26)/25+0.1;
    decorationCube3.position.x = Math.sin(virtualElapsedTime/90)/10+1.8;

    icoSphere.position.y = Math.sin(virtualElapsedTime*0.2)/30;
    icoSphere.position.x = Math.sin(virtualElapsedTime/20)/80;


    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    oldTime = elapsedTime;
}

animate();