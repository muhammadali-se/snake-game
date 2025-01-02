let scoreField = document.getElementById("score-field");
let coinField = document.getElementById("coin-field");
let score = 0;
let coin = 0;

class SnakeBody {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Board
let blockSize = 20;
let cols = 21;
let rows = 21;
let board;
let context;

// Snake
let snakeX = 10 * blockSize;
let snakeY = 10 * blockSize;
let velocityX = 0;
let velocityY = 0;
let snakeBody = [];

// Food
let foodX;
let foodY;

// Game State
let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d");

  if (window.innerWidth <= 600) {
    document.querySelector(".error").style.display = "flex";
    document.querySelector("canvas").style.display = "none";
    return;
  }

  placeFood();
  document.addEventListener("keydown", changeDirection);
  setInterval(update, 1000 / 10);
};

function update() {
  if (gameOver) {
    showGameOverPopup();
    return;
  }

  // Clear the board
  context.fillStyle = "#ffd0a4";
  context.fillRect(0, 0, board.width, board.height);

  // Draw food
  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  // Check if snake eats food
  if (snakeX === foodX && snakeY === foodY) {
    snakeBody.push(new SnakeBody(foodX, foodY));
    placeFood();
    coin += 100;
    coinField.innerText = coin;
    score++;
    scoreField.innerText = score;
    scoreField.style.color = "yellow"; // Highlight score temporarily
    setTimeout(() => (scoreField.style.color = "black"), 500);
  }

  // Move snake body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length) {
    snakeBody[0] = new SnakeBody(snakeX, snakeY);
  }

  // Update head position
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;

  // Draw snake
  context.fillStyle = "green";
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  context.fillStyle = "#4d1700";
  for (let part of snakeBody) {
    context.fillRect(part.x, part.y, blockSize, blockSize);
  }

  // Game Over conditions
  if (
    snakeX < 0 ||
    snakeX >= cols * blockSize ||
    snakeY < 0 ||
    snakeY >= rows * blockSize ||
    snakeBody.some(part => part.x === snakeX && part.y === snakeY)
  ) {
    gameOver = true;
  }
}

function changeDirection(e) {
  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

function placeFood() {
  do {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
  } while (snakeBody.some(part => part.x === foodX && part.y === foodY));
}

function showGameOverPopup() {
  const popup = document.getElementById("game-over-popup");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = score; // Display final score
  popup.style.display = "block"; // Show popup
}

document.getElementById("restart-button").addEventListener("click", () => {
  score = 0;
  coin = 0;
  scoreField.innerText = score;
  coinField.innerText = coin;
  snakeX = 10 * blockSize;
  snakeY = 10 * blockSize;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  gameOver = false;
  placeFood();
  document.getElementById("game-over-popup").style.display = "none";
});
