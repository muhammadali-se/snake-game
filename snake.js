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

// board
let blockSize = 20;
let cols = 21;
let rows = 21;
let board;
let context;

// Snake head
let snakeX = 10 * blockSize;
let snakeY = 10 * blockSize;

let velocityX = 0;
let velocityY = 0;

// Snake body
let snakeBody = [];

// Food
let foodX;
let foodY;

let gameOver = false;

window.onload = function () {
  board = document.getElementById("board");
  board.height = rows * blockSize;
  board.width = cols * blockSize;
  context = board.getContext("2d");

  placeFood();
  document.addEventListener("keydown", changeDirection);
  setInterval(update, 1000 / 10);
};

function update() {
  if (gameOver) {
    context.fillStyle = "black";
    context.font = "30px Arial";
    context.fillText("Game Over!", board.width / 4, board.height / 2);
    return;
  }

  context.fillStyle = "#ffd0a4";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = "red";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  if (snakeX === foodX && snakeY === foodY) {
    snakeBody.push(new SnakeBody(foodX, foodY));
    placeFood();
    coin += 100;
    coinField.innerText = coin;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  if (snakeBody.length) {
    snakeBody[0] = new SnakeBody(snakeX, snakeY);
  }

  context.fillStyle = "green";
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  context.fillStyle = "#4d1700";
  for (let part of snakeBody) {
    context.fillRect(part.x, part.y, blockSize, blockSize);
  }

  // Game over condition
  if (
    snakeX < 0 ||
    snakeX >= cols * blockSize ||
    snakeY < 0 ||
    snakeY >= rows * blockSize
  ) {
    gameOver = true;
    return;
  }

  for (let part of snakeBody) {
    if (snakeX === part.x && snakeY === part.y) {
      gameOver = true;
      return;
    }
  }

  // Increment score
  score++;
  scoreField.innerText = score;
}

let changeDirection = function (e) {
  if (e.code === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.code === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.code === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.code === "ArrowRight " && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

function placeFood() {
  let newFoodPosition;
  do {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
    newFoodPosition = snakeBody.some(part => part.x === foodX && part.y === foodY);
  } while (newFoodPosition);
}
