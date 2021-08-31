const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const canvas = document.querySelector("#canvas");
canvas.width = screenWidth;
canvas.height = screenHeight;
const context = canvas.getContext("2d");

let intervalId;
let scoreCounterId;

let score = 0;

let player = {
x: screenWidth / 2,
y: screenHeight / 2,
radius: 100,
color: "red",
};

class Ball{
    constructor(x, y, radius, color, speedX, speedY){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    checkCollision() {
        const distance = Math.sqrt(
            (player.x - this.x) ** 2 + (player.y - this.y) ** 2
        );
    
        return distance < player.radius + this.radius;
    }
    draw() {
        drawCircle(this.x, this.y, this.radius, this.color);
    }
    increaseSpeed() {
        this.speedX *= 1.001;
        this.speedY *= 1.001;
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    bounceOnEdge() {
        if (this.x < 0 || this.x > screenWidth) {
            this.speedX *= -1;
        }
    
        if (this.y < 0 || this.y > screenHeight) {
            this.speedY *= -1;
        }
    }
}

let mainEnemy = new Ball(0, 0, 30, "blue", 10, 10);
let enemies = [];
let friends = [];

function onMouseMove(event) {
    player.x = event.clientX;
    player.y = event.clientY;
}

function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}

function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    drawCircle(player.x, player.y, player.radius, player.color);
}

function printScore(){
    const scoreDiv = document.querySelector(".score");
    scoreDiv.innerHTML = `<h1>${score}</h1>`
}

function createEnemyOrFriend(){
    const prob = Math.random() * 100;
    xPos = screenWidth * Math.random();
    yPos = screenHeight * Math.random();
    if(prob < 1){
        const enemy = new Ball(xPos, yPos, 30, "black", 10, 10);
        enemies.push(enemy);
    }
    if(prob > 99){
        const friend = new Ball(xPos, yPos, 30, "green", 10, 10);
        friends.push(friend);
    }
}

function endGame() {
    alert(`Fim do jogo\n Sua pontuação: ${score}`);
    clearInterval(intervalId);
    clearInterval(scoreCounterId);
}

function startGame(enemy = mainEnemy) {
    clearScreen();
    player.x = screenWidth / 2;
    player.y = screenHeight / 2;

    enemy.x = 0;
    enemy.y = 0;
    enemy.speedX = 10;
    enemy.speedY = 10;
    clearInterval(scoreCounterId);
    clearInterval(intervalId);
    intervalId = setInterval(gameLoop, 1000 / 60);
    scoreCounterId = setInterval(() => {
        score += 1;
    }, 1000);
}

function gameLoop() {
    clearScreen();
    createEnemyOrFriend();
    printScore();
    mainEnemy.move();

    if (mainEnemy.checkCollision()) {
        endGame();
    }
    for(let i = 0; i < enemies.length; i++){
        enemies[i].move();
        enemies[i].bounceOnEdge();
        enemies[i].draw();
        if(enemies[i].checkCollision()){
            endGame();
        }
    }
    for( let i = 0; i< friends.length; i++){
        friends[i].move();
        friends[i].bounceOnEdge();
        friends[i].draw();
        if(friends[i].checkCollision()){
            score += 1;
        }
    }

    mainEnemy.bounceOnEdge();
    mainEnemy.increaseSpeed();

    drawPlayer();
    mainEnemy.draw();
}

startGame();