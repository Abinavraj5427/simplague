var people = [];
var population = 1000;
var socialDistancing = .1;
var socialDistancingParticipationRate = .5;
var infectionRadius = .3;//if in radius, then in adjacency list
var infectionProbability = .01;
var transportationRate = .02;
init();
for(var q=0;q<10;q++)
{
    spreadAgain();
    show();
}
function init() 
{
    for(var i=0;i<population;i++)
    {
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();

        var p = new Person(x,y,z,Math.random()<infectionProbability);

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
            else if(participating==false && dist<=infectionRadius)
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
    console.log(totalInfected());
}
function totalInfected()
{
    var t = 0;
    for(var a=0;a<people.length;a++)
        if(people[a].infected==true)
            t++;
    return t;
}
//give an array of each persons old position and new position
function spreadAgain()
{
    var updatedPeople = [];
    var updatedPeople2 = [];

    for(var a=0;a<people.length;a++)
    {
        var p = people[a];
        if(Math.random()<=transportationRate)
        {
            var newx = Math.random();
            var newy = Math.random();
            var newz = Math.random();
            var magnitude = Math.sqrt(Math.pow(newx,2)+Math.pow(newy,2)+Math.pow(newz,2));
            newx = newx/magnitude;
            newy = newy/magnitude;
            newz = newz/magnitude;
            updatedPeople.push(new pos(p.xpos,p.ypos,p.zpos,newx,newy,newz));
            p.xpos = newx;
            p.ypos = newy;
            p.zpos = newz;
            updatedPeople2.push(p);
        }
        else
        {
            var adj = p.adjacentPeople;

            if(p.infected==false)
                continue;
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
    if(updatedPeople.length>0)
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
            adj[d].adjacentPeople.pop(updatedPeople2[a]);
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
            else if(participating==false && dist<=infectionRadius)
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
};
function pos(oldxpos,oldypos,oldzpos,newxpos,newypos,newzpos)
{
    this.oldxpos = oldxpos;
    this.oldypos = oldypos;
    this.oldzpos = oldzpos;
    this.newxpos = newxpos;
    this.newypos = newypos;
    this.newzpos = newzpos;
}

