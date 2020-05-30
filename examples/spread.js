import {
    generateValidVector
} from './index.js';


import * as THREE from '../build/three.module.js';

var everyone = [];
var people = [];
var deadPeople = [];
var totalInfectedPeople = 0;
var totalDeadPeople = 0;
var totalDeathsOverTime = [];
var population = 1;
var socialDistancing = 0;
var socialDistancingParticipationRate = 0;
var infectionRadius = 0; //if in radius, then in adjacency list
var infectionProbability = 0;
var initialProbability = .02;
var transportationRate = 0;
var deathChance = .03;
var totalDays = 0;
//createWorld();

export function createWorld(positionData, ps, sds, sdr, irs, ips, trs) {
    totalDays = 0;
    people = [];
    deadPeople = [];
    totalDeathsOverTime = [];
    totalDays = 0;
    totalInfectedPeople = 0;
    totalDeadPeople = 0;
    population = ps;
    socialDistancing = sds / 100;
    socialDistancingParticipationRate = sdr / 100;
    infectionRadius = irs / 100;
    infectionProbability = ips / 100;
    transportationRate = trs / 100;
    console.log(population + " " + socialDistancing + " " + socialDistancingParticipationRate + " " + infectionRadius + " " + infectionProbability + " " + transportationRate);
    $("#total_days").html("Total Days: " + totalDays + " days");
    $("#total_infected").html("Total Infected: " + totalInfectedPeople + "/" + (people.length));
    $("#percent_infected").html("Percent Infected: " + (totalInfectedPeople / (people.length) * 100) + "%");
    $("#death_count").html("Total Dead: " + (totalDeadPeople));
    for (var i = 0; i < positionData.length; i++) {
        var x = positionData[i].position.x;
        var y = positionData[i].position.y;
        var z = positionData[i].position.z;
        // var x = Math.random();
        // var y = Math.random();
        // var z = Math.random();
        //var magnitude = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
        // x = x/magnitude;
        // y = y/magnitude;
        // z = z/magnitude;
        //console.log(Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2)));
        var infec = Math.random() <= initialProbability;
        if (infec == true)
            totalInfectedPeople++;
        var p = new Person(x, y, z, infec);

        for (var a = 0; a < people.length; a++) {
            var px = people[a].xpos;
            var py = people[a].ypos;
            var pz = people[a].zpos;
            var dist = distance(x, y, z, px, py, pz);
            var participating = Math.random() < socialDistancingParticipationRate;


            if (participating && dist + socialDistancing <= infectionRadius) {
                p.adjacentPeople.push(people[a]);
                people[a].adjacentPeople.push(p);
            }
            if (participating == false && dist <= infectionRadius) {
                p.adjacentPeople.push(people[a]);
                people[a].adjacentPeople.push(p);
            }
        }
        people.push(p);
    }
    // console.log(totalInfected());
    // for (var a = 0; a < 10; a++) {
    //     spreadAgain();
    //     show();
    //     //sleep(2500);


    // }

}

function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}

function show() {
    console.log("infected " + totalInfected());
    console.log("dead " + totalDead())
}

function totalInfected() {
    return totalInfectedPeople;
}

function totalDead() {
    return totalDeadPeople;
}

export function spreadAgain() {
    //   var updatedPeople = [];
    var updatedPeople2 = [];
    everyone = [];


    totalDays += 5;
    for (var a = 0; a < people.length; a++) {
        var p = people[a];

        if (p.dead == false && p.infected == true) {
            if (Math.random() < deathChance) {
                p.dead = true;
                deadPeople.push(p);
                totalDeadPeople++;
                totalInfectedPeople--;
            }
        }
        if (p.dead == false && p.infected == true) {
            if (Math.random() <= transportationRate) {
                var vector = generateValidVector();
                var newx = vector.x;
                var newy = vector.y;
                var newz = vector.z;
                // var magnitude = Math.sqrt(Math.pow(newx,2)+Math.pow(newy,2)+Math.pow(newz,2));
                // newx = newx/magnitude;
                // newy = newy/magnitude;
                // newz = newz/magnitude;
                // updatedPeople.push(vector);
                p.xpos = newx;
                p.ypos = newy;
                p.zpos = newz;
                updatedPeople2.push(p);
            }

            var adj = p.adjacentPeople;

            for (var aa = 0; aa < adj.length; aa++) {
                if (a != aa) {
                    var pp = adj[aa];
                    if (Math.random() < infectionProbability && pp.infected == false) {
                        pp.infected = true;
                        totalInfectedPeople++;
                    }
                }
            }
        }
        var col;
        if (p.dead == true)
            col = 0x000000; //black
        else if (p.infected)
            col = 0XFF0000; //red
        else
            col = 0XFFFFFF //white

        everyone.push({
            position: new THREE.Vector3(people[a].xpos, people[a].ypos, people[a].zpos),
            color: col
        });
    }
    if (updatedPeople2.length > 0) {
        recalibrate(updatedPeople2);
    }
    totalDeathsOverTime.push(deadPeople.length);
    $("#total_days").html("Total Days: " + totalDays + " days");
    $("#total_infected").html("Total Infected: " + totalInfectedPeople + "/" + (people.length - totalDeadPeople));
    $("#percent_infected").html("Percent Infected: " + (totalInfectedPeople / (people.length - totalDeadPeople) * 100) + "%");
    $("#death_count").html("Total Dead: " + (totalDeadPeople));
    show();
    return everyone;
}

function recalibrate(updatedPeople2) {
    for (var a = 0; a < updatedPeople2.length; a++) {
        var adj = updatedPeople2[a].adjacentPeople;
        for (var d = 0; d < adj.length; d++) {
            var adj2 = adj[d].adjacentPeople;
            for (var dd = 0; dd < adj2.length; dd++) {
                if (adj2[dd] == updatedPeople2[a]) {
                    adj2.splice(dd, 1);
                    break;
                }
            }
        }
        updatedPeople2[a].adjacentPeople = [];

        for (var i = 0; i < people.length; i++) {
            var p = people[i];
            var dist = distance(updatedPeople2[a].xpos, updatedPeople2[a].ypos, updatedPeople2[a].zpos, p.xpos, p.ypos, p.zpos);
            var participating = Math.random() < socialDistancingParticipationRate;

            if (participating && dist + socialDistancing <= infectionRadius) {
                p.adjacentPeople.push(updatedPeople2[a]);
                updatedPeople2[a].adjacentPeople.push(p);
            }
            if (participating == false && dist <= infectionRadius) {
                p.adjacentPeople.push(updatedPeople2[a]);
                updatedPeople2[a].adjacentPeople.push(p);
            }
        }
    }
}

function distance(x1, y1, z1, x2, y2, z2) {
    return Math.acos((x1 * x2) + (y1 * y2) + (z1 * z2));
}


function Person(xpos, ypos, zpos, infected) {
    this.xpos = xpos;
    this.ypos = ypos;
    this.zpos = zpos;
    this.infected = infected;
    this.adjacentPeople = [];
    this.dead = false;
};