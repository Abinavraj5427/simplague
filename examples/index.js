import * as THREE from '../build/three.module.js';
import {
    createWorld,
    spreadAgain
} from './spread.js';

import {
    OrbitControls
} from './jsm/controls/OrbitControls.js';



var container;

var camera, scene, renderer;

var mouseX = 0;
var mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var ps = 1000;
var sds;
var sdr;
var irs;
var ips;
var trs;

const globeRadius = 1;
const globeWidth = 2048 / 2;
const globeHeight = 1024 / 2;
var radiusOfSphere = 1;
var positionData = [];
var startButton = document.getElementById('simulate_btn');
var spreadbutton = document.getElementById('spread');
var spheres = [];

startButton.addEventListener('click', function () {
    createWorld(positionData, ps, sds, sdr, irs, ips, trs)
    positionData = spreadAgain();

    updatePeople();
});
spreadbutton.addEventListener('click', function () {
    positionData = spreadAgain();

    updatePeople();
});
var loaderPromise = new Promise(function (resolve, reject) {
    function loadDone(x) {
        console.log("loader successfully completed loading task");
        resolve(x); // it went ok!
    }
    var loader = new THREE.TextureLoader();
    loader.load('ojwD8.jpg', loadDone);
});
var texture;
loaderPromise.
then(function (response) {
    scene = new THREE.Scene();
    texture = response;
    positionData = createPeople(ps, radiusOfSphere);
    document.getElementById("loading").remove();
    var overlay = document.getElementById("overlay");
    var startbtn = document.createElement("button");
    startbtn.id = "startButton";
    startbtn.innerHTML = "START";
    startbtn.addEventListener('click', init);
    overlay.appendChild(startbtn);
}, function (err) {
    console.log(err);
});

function convertFlatCoordsToSphereCoords(x, y) {
    let latitude = ((x - globeWidth) / globeWidth) * -180;
    let longitude = ((y - globeHeight) / globeHeight) * -90;
    latitude = (latitude * Math.PI) / 180;
    longitude = (longitude * Math.PI) / 180;
    const radius = Math.cos(longitude) * globeRadius;

    return new THREE.Vector3(
        Math.cos(latitude) * radius,
        Math.sin(longitude) * globeRadius,
        Math.sin(latitude) * radius
    );
}

function getImageData(image) {

    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    return context.getImageData(0, 0, image.width, image.height);

}

function getPixel(imagedata, x, y) {

    var position = (x + imagedata.width * y) * 4,
        data = imagedata.data;
    return {
        r: data[position],
        g: data[position + 1],
        b: data[position + 2],
        a: data[position + 3]
    };

}

function createPeople(howMany) {

    // Create and array to store our vector3 point data
    var vectors = [];

    // Create new points using random x,y and z properties then setting vector length to radius

    for (var i = 0; i < howMany; i += 1) {
        var imagedata = getImageData(texture.image);
        do {
            var x = Math.floor(Math.random() * 2048);
            var y = Math.floor(Math.random() * 830);
        } while (getPixel(imagedata, x, y).b / getPixel(imagedata, x, y).r > 2.0 || getPixel(imagedata, x, y).b > 200 || (getPixel(imagedata, x, y).r > 200 && getPixel(imagedata, x, y).g > 130));
        var pos = convertFlatCoordsToSphereCoords(x, y);
        vectors.push({
            position: pos,
            color: new THREE.Vector3(1, 1, 1)
        });
        let geo = new THREE.SphereGeometry(.005, 6, 4);
        let mat = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

        var sphere = new THREE.Mesh(geo, mat);
        sphere.position.x = pos.x;
        sphere.position.y = pos.y;
        sphere.position.z = pos.z;

        spheres.push(sphere);
        scene.add(sphere);
    }

    return vectors;
}

function updatePeople() {
    for (var i = 0; i < ps; i++) {
        spheres[i].position.set(positionData[i].position.x, positionData[i].position.y, positionData[i].position.z);
        spheres[i].material.color.setHex(positionData[i].color);
    }
}

export function generateValidVector() {
    var imagedata = getImageData(texture.image);
    do {
        var x = Math.floor(Math.random() * 2048);
        var y = Math.floor(Math.random() * 830);
    } while (getPixel(imagedata, x, y).b / getPixel(imagedata, x, y).r > 2.0 || getPixel(imagedata, x, y).b > 200 || (getPixel(imagedata, x, y).r > 200 && getPixel(imagedata, x, y).g > 130));
    return convertFlatCoordsToSphereCoords(x, y);
}

function init() {

    var overlay = document.getElementById('overlay');
    overlay.remove();

    // var population_slider = document.getElementById("population");
    // var population_label = document.getElementById("population_label");
    // population_label.innerHTML = "Population: " + population_slider.value; // Display the default slider value
    // population_slider.oninput = function () {
    //     ps = this.value;

    //     population_label.innerHTML = "Population: " + this.value;
    // } // Update the current slider value (each time you drag the slider handle)
    // ps = population_slider.value;


    var social_distance_slider = document.getElementById("social_distance");
    var social_distance_label = document.getElementById("social_distance_label");
    social_distance_label.innerHTML = "Social Distance: " + social_distance_slider.value; // Display the default slider value
    social_distance_slider.oninput = function () {
        sds = this.value;

        social_distance_label.innerHTML = "Social Distance: " + this.value;
    } // Update the current slider value (each time you drag the slider handle)
    sds = social_distance_slider.value;

    var social_distance_rate_slider = document.getElementById("social_distance_rate");
    var social_distance_rate_label = document.getElementById("social_distance_rate_label");
    social_distance_rate_label.innerHTML = "Social Distance Participation Rate: " + social_distance_rate_slider.value + "%"; // Display the default slider value
    social_distance_rate_slider.oninput = function () {
        sdr = this.value;
        social_distance_rate_label.innerHTML = "Social Distance Participation Rate: " + this.value + "%";
    } // Update the current slider value (each time you drag the slider handle)
    sdr = social_distance_rate_slider.value;


    var infection_radius_slider = document.getElementById("infection_radius");
    var infection_radius_label = document.getElementById("infection_radius_label");
    infection_radius_label.innerHTML = "Infection Radius: " + infection_radius_slider.value; // Display the default slider value
    infection_radius_slider.oninput = function () {
        irs = this.value;

        infection_radius_label.innerHTML = "Infection Radius: " + this.value;
    } // Update the current slider value (each time you drag the slider handle)
    irs = infection_radius_slider.value;

    var infection_prob_slider = document.getElementById("infection_prob");
    var infection_prob_label = document.getElementById("infection_prob_label");
    infection_prob_label.innerHTML = "Infection Probability: " + infection_prob_slider.value + "%"; // Display the default slider value
    infection_prob_slider.oninput = function () {
        ips = this.value;

        infection_prob_label.innerHTML = "Infection Probability: " + this.value + "%";
    } // Update the current slider value (each time you drag the slider handle)
    ips = infection_prob_slider.value;

    var transportation_rate_slider = document.getElementById("transportation_rate");
    var transportation_rate_label = document.getElementById("transportation_rate_label");
    transportation_rate_label.innerHTML = "Transportation Rate: " + transportation_rate.value + "%"; // Display the default slider value
    transportation_rate_slider.oninput = function () {
        trs = this.value;

        transportation_rate_label.innerHTML = "Transportation Rate: " + this.value + "%";
    } // Update the current slider value (each time you drag the slider handle)
    trs = transportation_rate_slider.value;

    // var material = new THREE.ShaderMaterial({

    //     uniforms: {
    //         texture1: {
    //             type: "t",
    //             value: new THREE.TextureLoader().load('ojwD8.jpg')
    //         },
    //         subjects: {
    //             value: positionData
    //         }
    //     },

    //     vertexShader: document.getElementById('vertexShader').text,

    //     fragmentShader: document.getElementById('fragmentShader').text

    // });


    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    var geometry = new THREE.SphereGeometry(1, 128, 128);
    var globe = new THREE.Mesh(geometry, material);
    var controls;

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);



    var light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    camera.position.z = 5;
    controls.update();
    scene.add(globe);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);

    var skybox;
    var l1 = new Promise(function (resolve, reject) {
        function loadDone(x) {
            console.log("skybox loaded");
            resolve(x); // it went ok!
        }
        const loader = new THREE.CubeTextureLoader();
        skybox = loader.load([
            'textures/skybox/bkg1_right.png',
            'textures/skybox/bkg1_left.png',
            'textures/skybox/bkg1_top.png',
            'textures/skybox/bkg1_bot.png',
            'textures/skybox/bkg1_front.png',
            'textures/skybox/bkg1_back.png',
        ], loadDone);
    }).
    then(function (response) {
        scene.background = skybox;
        console.log("skybox loaded");

    }, function (err) {
        console.log(err);
    });

    //AUDIO
    var listener = new THREE.AudioListener();
    camera.add(listener);
    var sound = new THREE.Audio(listener);
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load('textures/bensound-slowmotion.ogg', //from ben-sound.com
        function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            sound.play();
        });
    createWorld(positionData, ps, sds, sdr, irs, ips, trs)
    positionData = spreadAgain();

    updatePeople();
    animate();
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