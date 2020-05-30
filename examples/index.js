import * as THREE from '../build/three.module.js';


import {
    OrbitControls
} from './jsm/controls/OrbitControls.js';

var container;

var camera, scene, renderer;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
let numSubjects = 5;

var subjectPos = [];
var i;
for (i = 0; i < numSubjects; i++) {
    var vector = (new THREE.Vector3(1.0, i, 0.0)).normalize();
    subjectPos.push(vector);
}
console.log(subjectPos);
var material = new THREE.ShaderMaterial({

    uniforms: {
        texture1: {
            type: "t",
            value: new THREE.TextureLoader().load('ojwD8.jpg')
        },
        subjects: {
            value: subjectPos
        }
    },

    vertexShader: document.getElementById('vertexShader').text,

    fragmentShader: document.getElementById('fragmentShader').text

});
var geometry = new THREE.SphereGeometry(1, 128, 128);
var globe = new THREE.Mesh(geometry, material);
var controls;


init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);

    scene = new THREE.Scene();

    var light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;
    controls.update();
    scene.add(globe);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);


}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY) * 0.3;
}

function animate() {
    requestAnimationFrame(animate);

    update();
    render();
}

function update() {}

function render() {
    renderer.render(scene, camera);
}