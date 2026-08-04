// =========================
// Hero
// =========================

const hero = document.getElementById("hero");

// =========================
// Game window
// =========================

const game = document.getElementById("game");

// =========================
// Buttons
// =========================

const jumpButton = document.getElementById("jumpButton");

const restartButton = document.getElementById("restartButton");

// =========================
// Score
// =========================

const scoreText = document.getElementById("score");

const finalScore = document.getElementById("finalScore");

const gameOverWindow = document.getElementById("gameOver");

// =========================
// Hero physics
// =========================

let heroX = 150;

let heroY = 360;

let velocityY = 0;

let velocityX = 0;

const gravity = 0.8;

let score = 0;

let gameOver = false;

// =========================
// Jump charging
// =========================

let holdStart = 0;

let charging = false;

// =========================
// Platforms
// =========================

let platforms = [];

createPlatform(0,450,300);

createPlatform(430,450,260);

createPlatform(820,450,250);

// =========================
// Create one platform
// =========================

function createPlatform(x,y,width){

    const platform=document.createElement("div");

    platform.className="platform";

    platform.style.left=x+"px";

    platform.style.top=y+"px";

    platform.style.width=width+"px";

    game.appendChild(platform);

    platforms.push({

        x:x,

        y:y,

        width:width,

        element:platform

    });

}

// =========================
// Hold button
// =========================

jumpButton.addEventListener("mousedown",()=>{

    charging=true;

    holdStart=Date.now();

});

jumpButton.addEventListener("mouseup",()=>{

    if(gameOver) return;

    charging=false;

    let hold=Date.now()-holdStart;

    if(hold>1000){

        hold=1000;

    }

    velocityY=-14-(hold/100);

    velocityX=4+(hold/250);

});

// Mobile

jumpButton.addEventListener("touchstart",(e)=>{

    e.preventDefault();

    charging=true;

    holdStart=Date.now();

});

jumpButton.addEventListener("touchend",(e)=>{

    e.preventDefault();

    if(gameOver) return;

    charging=false;

    let hold=Date.now()-holdStart;

    if(hold>1000){

        hold=1000;

    }

    velocityY=-14-(hold/100);

    velocityX=4+(hold/250);

});
// =========================
// Main Game Loop
// =========================

function update() {

    if (gameOver) return;

    // Gravity
    velocityY += gravity;

    // Move hero
    heroX += velocityX;
    heroY += velocityY;

    // Friction (slow horizontal movement)
    velocityX *= 0.99;

    // Collision with platforms
    let onGround = false;

    platforms.forEach(platform => {

        if (
            heroX + 60 > platform.x &&
            heroX < platform.x + platform.width &&
            heroY + 70 >= platform.y &&
            heroY + 70 <= platform.y + 20 &&
            velocityY >= 0
        ) {

            heroY = platform.y - 70;
            velocityY = 0;
            onGround = true;

        }

    });

    // Fell into a gap
    if (heroY > 600) {

        endGame();

    }

    // Move platforms when hero reaches center
    if (heroX > 500) {

        let move = heroX - 500;

        heroX = 500;

        platforms.forEach(platform => {

            platform.x -= move;
            platform.element.style.left = platform.x + "px";

        });

    }

    // Remove old platforms
    while (platforms.length > 0 && platforms[0].x + platforms[0].width < 0) {

        platforms[0].element.remove();

        platforms.shift();

        score++;

        scoreText.innerHTML = "Score: " + score;

        createNextPlatform();

    }

    // Draw hero
    hero.style.left = heroX + "px";
    hero.style.top = heroY + "px";

    requestAnimationFrame(update);

}

requestAnimationFrame(update);


// =========================
// Generate Next Platform
// =========================


function createNextPlatform() {

    let last = platforms[platforms.length - 1];

    // Случайная ширина платформы
    let width = 180 + Math.random() * 180;

    // Случайная ширина пропасти
    let gap = 100 + Math.random() * 170;

    // Иногда делаем сложнее
    if (Math.random() > 0.7) {

        gap += 60;

    }

    createPlatform(

        last.x + last.width + gap,

        450,

        width

    );

}


// =========================
// Game Over
// =========================

function endGame() {

    gameOver = true;

    gameOverWindow.style.display = "flex";

    finalScore.innerHTML = "Score: " + score;

}


// =========================
// Restart
// =========================

restartButton.onclick = function () {

    location.reload();

}
// =========================
// Improve Hero Animation
// =========================

setInterval(() => {

    if (gameOver) return;

    // Поворачиваем героя по направлению прыжка
    if (velocityX > 0) {

        hero.style.transform = "scaleX(1)";

    }

    // Небольшой наклон во время полета
    if (velocityY < -2) {

        hero.style.rotate = "-8deg";

    }
    else if (velocityY > 3) {

        hero.style.rotate = "8deg";

    }
    else {

        hero.style.rotate = "0deg";

    }

}, 16);


// =========================
// Limit Hero Speed
// =========================

setInterval(() => {

    if (velocityX > 10)
        velocityX = 10;

    if (velocityY > 20)
        velocityY = 20;

},16);


// =========================
// Prevent Hero Leaving Screen
// =========================

setInterval(() => {

    if(heroX<0){

        heroX=0;

    }

},16);
