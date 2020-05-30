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

var numberOfPoints = 7000;
var radiusOfSphere = 1;

var positionData = getCartesianPositions(numberOfPoints, radiusOfSphere);

// Convert out positionData into a float32Array for handing to the buffer geometry
const positions = new Float32Array(positionData.length * 3);
positionData.forEach(function(vert, vertIndex) {
	vert.toArray(positions, vertIndex * 3);
}, this);

// immediately use the texture for material creation
var material = new THREE.ShaderMaterial({

    uniforms: {


        texture1: {
            type: "t",
            value: THREE.ImageUtils.loadTexture('ojwD8.jpg')
        }
    },

    vertexShader: document.getElementById('vertexShader').text,

    fragmentShader: document.getElementById('fragmentShader').text

});
var geometry = new THREE.SphereGeometry(1, 128, 128);
var cube = new THREE.Mesh(geometry, material);
var controls;


init();
animate();

function getCartesianPositions(howMany, radius) {
	// Create and array to store our vector3 point data
	var vectors = [];

	// Create new points using random x,y and z properties then setting vector length to radius

	for (var i = 0; i < howMany; i += 1) {
		var vec3 = new THREE.Vector3();

		vec3.x = THREE.Math.randFloatSpread(1);
		vec3.y = THREE.Math.randFloatSpread(1);
		vec3.z = THREE.Math.randFloatSpread(1);

		vec3.setLength(radius);

		vectors.push(vec3);
	}

	return vectors;
}

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
    scene.add(cube);

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


//

function animate() {
    requestAnimationFrame(animate);

    update();
    render();
}

function update() {
    cube.rotation.y += 0.001;
}

function render() {
    renderer.render(scene, camera);
}