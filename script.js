const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let player1Score = 0;
let player2Score = 0;

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dy: 0
};

const player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    dy: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 5,
    dx: 5,
    dy: 5,
    color: '#fff'
};

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function update() {
    // Update player positions
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Ensure paddles stay within canvas
    if (player1.y < 0) player1.y = 0;
    if (player1.y + player1.height > canvas.height) player1.y = canvas.height - player1.height;
    if (player2.y < 0) player2.y = 0;
    if (player2.y + player2.height > canvas.height) player2.y = canvas.height - player2.height;

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Check for collisions with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Check for collisions with paddles
    if (
        (ball.x - ball.radius < player1.x + player1.width && 
         ball.y > player1.y && 
         ball.y < player1.y + player1.height) || 
        (ball.x + ball.radius > player2.x && 
         ball.y > player2.y && 
         ball.y < player2.y + player2.height)
    ) {
        ball.dx *= -1;
    }

    // Check for scoring
    if (ball.x + ball.radius < 0) {
        player2Score++;
        resetBall();
    } else if (ball.x - ball.radius > canvas.width) {
        player1Score++;
        resetBall();
    }

    document.getElementById('player1Score').textContent = player1Score;
    document.getElementById('player2Score').textContent = player2Score;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
    ball.speed = 5;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player2.dy = -5;
            break;
        case 'ArrowDown':
            player2.dy = 5;
            break;
        case 'w':
            player1.dy = -5;
            break;
        case 's':
            player1.dy = 5;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            player2.dy = 0;
            break;
        case 'w':
        case 's':
            player1.dy = 0;
            break;
    }
});

gameLoop();
