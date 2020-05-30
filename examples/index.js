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

var population_slider = document.getElementById("population");
var population_label = document.getElementById("population_label");
population_label.innerHTML = "Population: "+population_slider.value; // Display the default slider value
population_slider.oninput = function() {population_label.innerHTML = "Population: "+this.value;}// Update the current slider value (each time you drag the slider handle)

var social_distance_slider = document.getElementById("social_distance");
var social_distance_label = document.getElementById("social_distance_label");
social_distance_label.innerHTML = "Social Distance: "+social_distance_slider.value; // Display the default slider value
social_distance_slider.oninput = function() {social_distance_label.innerHTML = "Social Distance: "+this.value;}// Update the current slider value (each time you drag the slider handle)

var social_distance_rate_slider = document.getElementById("social_distance_rate");
var social_distance_rate_label = document.getElementById("social_distance_rate_label");
social_distance_rate_label.innerHTML = "Social Distance Participation Rate: "+social_distance_slider.value+"%"; // Display the default slider value
social_distance_rate_slider.oninput = function() {social_distance_rate_label.innerHTML = "Social Distance Participation Rate: "+this.value+"%";}// Update the current slider value (each time you drag the slider handle)

var infection_radius_slider = document.getElementById("infection_radius");
var infection_radius_label = document.getElementById("infection_radius_label");
infection_radius_label.innerHTML = "Infection Radius: "+infection_radius_slider.value; // Display the default slider value
infection_radius_slider.oninput = function() {infection_radius_label.innerHTML = "Infection Radius: "+this.value;}// Update the current slider value (each time you drag the slider handle)

var infection_prob_slider = document.getElementById("infection_prob");
var infection_prob_label = document.getElementById("infection_prob_label");
infection_prob_label.innerHTML = "Infection Probability: "+infection_prob_slider.value+"%"; // Display the default slider value
infection_prob_slider.oninput = function() {infection_prob_label.innerHTML = "Infection Probability: "+this.value+"%";}// Update the current slider value (each time you drag the slider handle)

var transportation_rate_slider = document.getElementById("transportation_rate");
var transportation_rate_label = document.getElementById("transportation_rate_label");
transportation_rate_label.innerHTML = "Transportation Rate: "+transportation_rate.value+"%"; // Display the default slider value
transportation_rate_slider.oninput = function() {transportation_rate_label.innerHTML = "Transportation Rate: "+this.value+"%";}// Update the current slider value (each time you drag the slider handle)


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