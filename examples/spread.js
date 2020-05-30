

var people = [];
init();


function init() 
{
    for(var i=0;i<100;i++)
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

            if(distance(x,y,z,px,py,pz)<.5)
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