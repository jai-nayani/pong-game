const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 14;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6; // For AI only
const BALL_SPEED = 6;

// State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = (canvas.width - BALL_SIZE) / 2;
let ballY = (canvas.height - BALL_SIZE) / 2;
let ballVelX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Player paddle follows mouse
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle inside canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw everything
function draw() {
    // Clear
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mid line
    ctx.strokeStyle = "#fff3";
    ctx.beginPath();
    ctx.setLineDash([12, 12]);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

    // Draw Score
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width/2 - 100, 50);
    ctx.fillText(aiScore, canvas.width/2 + 100, 50);
}

// Simple AI for right paddle
function updateAI() {
    const paddleCenter = aiY + PADDLE_HEIGHT / 2;
    if (paddleCenter < ballY + BALL_SIZE/2 - 10) {
        aiY += PADDLE_SPEED;
    } else if (paddleCenter > ballY + BALL_SIZE/2 + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Ball movement and collisions
function updateBall() {
    ballX += ballVelX;
    ballY += ballVelY;

    // Top and bottom collision
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVelY = -ballVelY;
        ballY = Math.max(0, Math.min(canvas.height - BALL_SIZE, ballY));
    }

    // Left paddle collision
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballVelX = Math.abs(ballVelX);
        // Add a bit of randomness
        ballVelY += (Math.random() - 0.5) * 2;
    }

    // Right paddle collision
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballVelX = -Math.abs(ballVelX);
        // Add a bit of randomness
        ballVelY += (Math.random() - 0.5) * 2;
    }

    // Left wall (AI scores)
    if (ballX <= 0) {
        aiScore++;
        resetBall();
    }

    // Right wall (Player scores)
    if (ballX + BALL_SIZE >= canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = (canvas.width - BALL_SIZE) / 2;
    ballY = (canvas.height - BALL_SIZE) / 2;
    ballVelX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();