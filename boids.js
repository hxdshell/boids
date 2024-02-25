const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth-20;
canvas.height = window.innerHeight-20;

window.addEventListener("resize",()=>{
    canvas.width = window.innerWidth-20;
    canvas.height = window.innerHeight-20; 
});

function random(start,end){
    const rand = Math.floor(Math.random()*(end-start))+start;
    return (rand != 0) ? rand : 1;
}

function distance(x1,x2,y1,y2){
    return Math.sqrt(
        Math.pow(x2-x1,2)+
        Math.pow(y2-y1,2)
    );
}

class Boid{
    constructor(x,y,velX,velY){
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }

    // avoid running into other boids
    separation(){
        let closeX = 0,closeY = 0;
        const avoidFactor = 0.05;

        for(const boid of boids){
            if(boid != this && distance(this.x,boid.x,this.y,boid.y) < 20){
                closeX += this.x - boid.x;
                closeY += this.y - boid.y;
            }
        }
        this.velX += closeX * avoidFactor;
        this.velY += closeY * avoidFactor;
    }

    // match the velocity of other boids
    alignment(){
        let closeX = 0,closeY = 0,count = 0;
        const aligningFactor = 0.05;

        for(const boid of boids){
            if(boid != this && distance(this.x,boid.x,this.y,boid.y) < 100){
                closeX += boid.velX;
                closeY += boid.velY;
                count++;
            }
        }
        if(count > 0){
            closeX /= count;
            closeY /= count;
        }

        this.velX += (closeX-this.velX) * aligningFactor;
        this.velY += (closeY-this.velY) * aligningFactor;

    }
    // steer towards the center of other boids
    cohesion(){
        let closeX = 0, closeY = 0, count = 0;
        const cohesionFactor = 0.005;

        for(const boid of boids){
            if(boid != this && distance(this.x,boid.x,this.y,boid.y) < 100){
                closeX += boid.x;
                closeY += boid.y;
                count++;
            }
        }
        if(count > 0){
            closeX /= count;
            closeY /= count;
        }

        this.velX += (closeX-this.x) * cohesionFactor;
        this.velY += (closeY-this.y) * cohesionFactor;
    }

    //limit the speed
    controlSpeed(){
        const speed = distance(0,this.velX,0,this.velY);
        const limit = 10;

        if(speed > limit){
            this.velX = (this.velX/speed)*limit;
            this.velY = (this.velY/speed)*limit;
        }
        if(speed < limit){
            this.velX = (this.velX/speed)*limit;
            this.velY = (this.velY/speed)*limit;
        }
    }
    draw(){
        ctx.fillStyle="white";
        const angle = Math.atan2(this.velY,this.velX);
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(15, 7);
        ctx.lineTo(-15, 7);
        ctx.lineTo(0,0);
        ctx.fill();

        ctx.rotate(-angle);
        ctx.translate(-this.x, -this.y);
    }
    avoidWalls(){
        const margin = 150;
        const turnFactor = 0.7;
        

        if(this.x > canvas.width-margin)
            this.velX -= turnFactor;
        if(this.x <= margin)
            this.velX += turnFactor;
        if(this.y > canvas.height-margin)
            this.velY -= turnFactor;
        if(this.y <= margin)
            this.velY += turnFactor;

        this.x += this.velX;
        this.y += this.velY;
    }
}
let boids = [];
let boid = null;
while(boids.length < 250){
    boid = new Boid(
        random(10,canvas.width-10),
        random(10,canvas.height-10),
        random(-5,5),
        random(-5,5)
    )
    boids.push(boid);
}
function animate(){
    ctx.fillStyle = "rgb(17 17 17)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(const boid of boids){
        boid.separation();
        boid.alignment();
        boid.cohesion();
        boid.avoidWalls();
        boid.controlSpeed();
        boid.draw();
    }
    requestAnimationFrame(animate);
}
animate();