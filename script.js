const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = '32px Impact';


let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = []
let score = 0;


class Raven {
    constructor() {
        this.sprite = {
            width: 271,
            height: 194,
        }
        this.sizeModifier = Math.random() * 0.6 + 0.2;
        this.size = {
            width: this.sprite.width * this.sizeModifier,
            height: this.sprite.height * this.sizeModifier,
        }
        this.position = {
            x: canvas.width, //spawn to the right of the canvas
            y: Math.random() * (canvas.height - this.size.height),
        };
        this.direction = {
            x: Math.random() * 2 + 3,
            y: Math.random() * 5 - 2.5,
        };
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "/images/raven.png";
        this.animation = {
            currentFrame: 0,
            maxFrame: 5, //0-based
            flapInterval: Math.random() * 70 + 30, //in milliseconds
            timeSinceFlap: 0,
        }
    }

    update(deltaTime) {
        //change direction in top or bottom edges
        if (this.position.y < 0 || this.position.y > canvas.height - this.size.height) {
            this.direction.y = this.direction.y * -1;
        }

        this.position.x -= this.direction.x;
        this.position.y += this.direction.y;

        this.animation.timeSinceFlap += deltaTime;


        if (this.animation.timeSinceFlap > this.animation.flapInterval) {
            this.animation.currentFrame < this.animation.maxFrame
                ? this.animation.currentFrame++
                : this.animation.currentFrame = 0;
            this.animation.timeSinceFlap = 0;
        }

        if (this.position.x < 0 - this.size.width) { //if raven leaves the canvas, remove it
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.drawImage(this.image,
            this.animation.currentFrame * this.sprite.width,
            0,
            this.sprite.width,
            this.sprite.height,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height)
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 27, 52);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 25, 50);
}

window.addEventListener("click", e =>{
    const detectedPixelColor = ctx.getImageData(e.offsetX, e.offsetY, 1,1);
    console.log(detectedPixelColor.data);
})

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;


    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven())
        timeToNextRaven = 0;
    }

    //draw score before ravens
    drawScore();

    ravens.forEach(raven => {
        raven.update(deltaTime);
        raven.draw(ctx);
    })
    ravens = ravens.filter(raven => !raven.markedForDeletion);

    requestAnimationFrame(animate);
}

animate(0);