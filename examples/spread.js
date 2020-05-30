//import * as THREE from '../build/three.module.js';

var people = [];
var deadPeople = [];
var population = 1000;
var socialDistancing = .05;
var socialDistancingParticipationRate = .5;
var infectionRadius = .05;//if in radius, then in adjacency list
var infectionProbability = .1;
var initialProbability = .01;
var transportationRate = .1;
var deathChance = .05;
init();
for(var q=0;q<100;q++)
{
    spreadAgain();
    show();
    if(totalInfected()==population)
    break;
}
function init() 
{
    for(var i=0;i<population;i++)
    {
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();
        var magnitude = Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
        x = x/magnitude;
        y = y/magnitude;
        z = z/magnitude;
        
        var p = new Person(x,y,z,Math.random()<=initialProbability);

        for(var a=0;a<people.length;a++)
        {
            var px = people[a].xpos;
            var py = people[a].ypos;
            var pz = people[a].zpos;
            var dist = distance(x,y,z,px,py,pz);
            var participating = Math.random()<socialDistancingParticipationRate;
            

            if(participating && dist+socialDistancing<=infectionRadius)
            {
                p.adjacentPeople.push(people[a]);
                people[a].adjacentPeople.push(p);
            }
            if(participating==false && dist<=infectionRadius)
            {
                p.adjacentPeople.push(people[a]);
                people[a].adjacentPeople.push(p);
            }
        }
        people.push(p);
    }
    // for(var a=0;a<people.length;a++)
    // {
    //     console.log(people[a].adjacentPeople.length);
    // }
    console.log(totalInfected());
}
function show()
{
    console.log("infected "+totalInfected());
    console.log("dead "+totalDead())
}
function totalInfected()
{
    var t = 0;
    for(var a=0;a<people.length;a++)
        if(people[a].infected==true && people[a].dead==false)
            t++;
    return t;
}
function totalDead()
{
    var t = 0;
    for(var a=0;a<people.length;a++)
        if(people[a].dead==true)
            t++;
    return t;
}

function spreadAgain()
{
    var updatedPeople = [];
    var updatedPeople2 = [];

    for(var a=0;a<people.length;a++)
    {
        var p = people[a];

        if(p.dead==false && p.infected==true)
        {
            if(Math.random()<deathChance)
            {
                p.dead=true;
                deadPeople.push(p);
            }
        }
        if(p.dead==false && p.infected==true)
        {
            if(Math.random()<=transportationRate)
            {
                var newx = Math.random();
                var newy = Math.random();
                var newz = Math.random();
                var magnitude = Math.sqrt(Math.pow(newx,2)+Math.pow(newy,2)+Math.pow(newz,2));
                newx = newx/magnitude;
                newy = newy/magnitude;
                newz = newz/magnitude;
    //            updatedPeople.push(new THREE.Vector3(newx, newy, newz));
                p.xpos = newx;
                p.ypos = newy;
                p.zpos = newz;
                updatedPeople2.push(p);
            }
            
            var adj = p.adjacentPeople;

            for(var aa=0;aa<adj.length;aa++)
            {
                if(a!=aa)
                {
                    var pp = adj[aa];
                    if(Math.random()<infectionProbability)
                    {
                        pp.infected = true;
                    }
                }
            }
        }
    }
    if(updatedPeople2.length>0)
    {
        recalibrate(updatedPeople2);
    }
    return updatedPeople;
}

function recalibrate(updatedPeople2)
{
    for(var a=0;a<updatedPeople2.length;a++)
    {
        var adj = updatedPeople2[a].adjacentPeople;
        for(var d=0;d<adj.length;d++)
        {
            adj2 = adj[d].adjacentPeople;
            for(var dd=0;dd<adj2.length;dd++)
            {
                if(adj2[dd]==updatedPeople2[a])
                {
                    adj2.splice(dd,1);
                    break;
                }
            }
        }
        updatedPeople2[a].adjacentPeople = [];

        for(var i=0;i<people.length;i++)
        {
            var p = people[i];
            var dist = distance(updatedPeople2[a].xpos,updatedPeople2[a].ypos,updatedPeople2[a].zpos,p.xpos,p.ypos,p.zpos);
            var participating = Math.random()<socialDistancingParticipationRate;

            if(participating && dist+socialDistancing<=infectionRadius)
            {
                p.adjacentPeople.push(updatedPeople2[a]);
                updatedPeople2[a].adjacentPeople.push(p);
            }
            if(participating==false && dist<=infectionRadius)
            {
                p.adjacentPeople.push(updatedPeople2[a]);
                updatedPeople2[a].adjacentPeople.push(p);
            }
        }
    }
}

function distance(x1,y1,z1,x2,y2,z2)
{
    return Math.acos((x1*x2)+(y1*y2)+(z1*z2));
}


function Person(xpos, ypos, zpos, infected) 
{
    this.xpos = xpos;
    this.ypos=ypos;
    this.zpos=zpos;
    this.infected=infected;
    this.adjacentPeople = [];
    this.dead=false;
};