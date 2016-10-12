/**
 * Created by elikr on 10/10/2016.
 */
'use strict';

$(document).ready(function() {
let width = 300;
let height = 500;
let gLoop;
let points = 0;
let state = true;
let c = document.getElementById('game');
let ctx = c.getContext('2d');

c.width = width;
c.height = height;

let clear = function () {
 ctx.fillStyle = '#d0e7f9';
 ctx.clearRect(0, 0, width, height);
 ctx.beginPath();
 ctx.rect(0, 0, width, height);
 ctx.closePath();
 ctx.fill();
};

    let Platform = function(x, y, type){
        let that=this;

        that.firstColor = '#FF8C00';
        that.secondColor = '#EEEE00';
        that.onCollide = function(){
            truck1.fallStop();
        };

        if (type === 1) {
            that.firstColor = '#AA00EE';
            that.secondColor = '#698B22';
            that.onCollide = function(){
                truck1.fallStop();
                truck1.jumpSpeed = 50;
            };
        }

        that.x = ~~ x;
        that.y = y;
        that.type = type;

        that.isMoving = ~~(Math.random() * 2);
        that.direction= ~~(Math.random() * 2) ? -1 : 1;

        that.draw = function(){
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            let gradient = ctx.createRadialGradient(that.x + (platformWidth/2), that.y + (platformHeight/2), 5, that.x + (platformWidth/2), that.y + (platformHeight/2), 45);
            gradient.addColorStop(0, that.firstColor);
            gradient.addColorStop(1, that.secondColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(that.x, that.y, platformWidth, platformHeight);
        };

        return that;
    };
let truck1 = new (function(){
    let that = this;
    that.image = new Image();

    that.image.src = "Images/eto.jpg"
    that.width = 65;
    that.height = 95;
    that.frames = 1;
    that.actualFrame = 0;
    that.X = 0;
    that.Y = 0;

    that.isJumping = false;
    that.isFalling = false;
    that.jumpSpeed = 0;
    that.fallSpeed = 0;

    that.jump = function() {
        if (!that.isJumping && !that.isFalling) {
            that.fallSpeed = 0;
            that.isJumping = true;
            that.jumpSpeed = 17;
        }
    };

    that.checkJump = function() {
        if (that.Y > height*0.4) {
            that.setPosition(that.X, that.Y - that.jumpSpeed);
        }
        else {
            if (that.jumpSpeed > 10)
                points++;

            platforms.forEach(function(platform, ind){
                platform.y += that.jumpSpeed;

                if (platform.y > height) {
                    let type = ~~(Math.random() * 5);
                    if (type == 0)
                        type = 1;
                    else
                        type = 0;

                    platforms[ind] = new Platform(Math.random() * (width - platformWidth), platform.y - height, type);
                }
            });
        }


        that.jumpSpeed--;
        if (that.jumpSpeed == 0) {
            that.isJumping = false;
            that.isFalling = true;
            that.fallSpeed = 1;
        }
    };

    that.fallStop = function(){
        that.isFalling = false;
        that.fallSpeed = 0;
        that.jump();
    };

    that.checkFall = function(){
        if (that.Y < height - that.height) {
            that.setPosition(that.X, that.Y + that.fallSpeed);
            that.fallSpeed++;
        } else {
            if (points == 0)
                that.fallStop();
            else
                GameOver();
        }
    };

    that.moveLeft = function(){
        if (that.X > 0) {
            that.setPosition(that.X - 5, that.Y);
        }
    };

    that.moveRight = function(){
        if (that.X + that.width < width) {
            that.setPosition(that.X + 5, that.Y);
        }
    };

    that.setPosition = function(x, y){
        that.X = x;
        that.Y = y;
    };

    that.interval = 5;
    that.draw = function(){
        try {
            ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X,
                that.Y, that.width, that.height);
        }
        catch (e) {
        };

        if (that.interval == 4 ) {
            if (that.actualFrame == that.frames) {
                that.actualFrame = 0;
            }
            else {
                that.actualFrame++;
            }
            that.interval = 0;
        }
        that.interval++;
    }
})();

truck1.setPosition(~~((width-truck1.width)/2), height - truck1.height);
truck1.jump();

document.onmousemove = function(e){
    if (truck1.X + c.offsetLeft > e.pageX) {
        truck1.moveLeft();
    } else if (truck1.X + c.offsetLeft < e.pageX) {
        truck1.moveRight();
    }
};

let nrOfPlatforms = 7,
        platforms = [],
        platformWidth = 70,
        platformHeight = 20;


let generatePlatforms = function(){
    let position = 0, type;
    for (let i = 0; i < nrOfPlatforms; i++) {
        type = ~~(Math.random()*5);
        if (type == 0)
            type = 1;
        else
            type = 0;
        platforms[i] = new Platform(Math.random() * (width - platformWidth), position, type);
        if (position < height - platformHeight)
            position += ~~(height / nrOfPlatforms);
    }
}();

let checkCollision = function(){
    platforms.forEach(function(e, ind){
        if (
                (truck1.isFalling) &&
                (truck1.X < e.x + platformWidth) &&
                (truck1.X + truck1.width > e.x) &&
                (truck1.Y + truck1.height > e.y) &&
                (truck1.Y + truck1.height < e.y + platformHeight)
        ) {
            e.onCollide();
        }
    })
};

let GameLoop = function(){
    clear();
    //MoveTruck1(5);

    if (truck1.isJumping) truck1.checkJump();
    if (truck1.isFalling) truck1.checkFall();

    truck1.draw();

    platforms.forEach(function(platform, index){
        if (platform.isMoving) {
            if (platform.x < 0) {
                platform.direction = 1;
            } else if (platform.x > width - platformWidth) {
                platform.direction = -1;
            }
            platform.x += platform.direction * (index / 2) * ~~(points / 100);
        }
        platform.draw();
    });

    checkCollision();

    ctx.fillStyle = "Black";
    ctx.fillText("POINTS:" + points, 10, height-10);

    if (state)
        gLoop = setTimeout(GameLoop, 1000 / 50);
};

let GameOver = function(){
    state = false;
    clearTimeout(gLoop);
    setTimeout(function(){
        clear();

        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
        ctx.fillText("YOUR RESULT:" + points, width / 2 - 60, height / 2 - 30);
    }, 100);
};

GameLoop();
});
