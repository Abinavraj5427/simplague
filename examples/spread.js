var people = [];
var population = 100;
var socialDistancing = .02;
var socialDistancingParticipationRate = .7;
var infectionRadius = .1;//if in radius, then in adjacency list
var infectionProbability = .6;
var transportationRate = .02;
init();

function init() 
{
    for(var i=0;i<population;i++)
    {
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();
        var p = new Person(x,y,z,false);

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
            else if(dist<=infectionRadius)
            {
                p.adjacentPeople.push(people[a]);
                people[a].adjacentPeople.push(p);
            }
        }
        people.push(p);
    }
    for(var a=0;a<people.length;a++)
    {
        console.log(people[a].adjacentPeople.length);
    }
}
//give an array of each persons old position and new position
function spreadAgain()
{
    var updatedPeople = [];
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
            pos.push(new pos(p.xpos,p.ypos,p.zpos,newx,newy,newz));
            p.xpos = newx;
            p.ypos = newy;
            p.zpos = newz;
        }
        else
        {
            var adj = p.adjacentPeople;

            for(var aa=0;aa<adj.length;aa++)
            {
                if(a!=aa)
                {
                    var pp = adj[aa];

                    if(p.infected==true && Math.random()<infectionProbability)
                    {
                        pp.infected = true;
                    }
                }
            }
        }
    }
    if(updatedPeople.length>0)
    {
        clearAdjacents();
        recalibrate();
    }
    return updatedPeople;
}

function clearAdjacents()
{
    for(var i=0;i<people.length;i++)
    {
        people[i].adjacentPeople = [];
    }
}
function recalibrate()
{
    for(var i=0;i<people.length;i++)
    {
        var p = people[i];
        var x = p.xpos;
        var y = p.ypos;
        var z = p.zpos;

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
            else if(dist<=infectionRadius)
            {
                p.adjacentPeople.push(people[a]);
                people[a].adjacentPeople.push(p);
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