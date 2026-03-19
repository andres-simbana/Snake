const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const maxScoreDisplay = document.getElementById('maxScore');
const restartButton = document.getElementById('restartButton');
const bgMusic = document.getElementById('bgMusic');

const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('game-over.mp3');

let gameSpeed = 100;
let snakeSpeed = 20;

let snake;
let direction;
let food;
let score;
let gameOver;
let objects;
let difficultySelected = false;

let maxScore = localStorage.getItem('maxScore') || 0;
maxScoreDisplay.textContent = `Puntaje Máximo: ${maxScore}`;

function initGame() {
    snake = [{ x: 160, y: 160 }];
    direction = { x: 0, y: 0 };
    food = randomFoodPosition();
    score = 0;
    gameOver = false;
    objects = generateFakeObjects();
    updateScore();
    restartButton.classList.add('hidden');
}

function randomFoodPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / snakeSpeed)) * snakeSpeed,
        y: Math.floor(Math.random() * (canvas.height / snakeSpeed)) * snakeSpeed
    };
}

function generateFakeObjects() {
    let fakeObjects = [];
    for (let i = 0; i < 5; i++) {
        fakeObjects.push({
            x: Math.floor(Math.random() * (canvas.width / snakeSpeed)) * snakeSpeed,
            y: Math.floor(Math.random() * (canvas.height / snakeSpeed)) * snakeSpeed
        });
    }
    return fakeObjects;
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, snakeSpeed, snakeSpeed);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, snakeSpeed, snakeSpeed);
}

function drawObjects() {
    ctx.fillStyle = 'yellow';
    objects.forEach(obj => {
        ctx.fillRect(obj.x, obj.y, snakeSpeed, snakeSpeed);
    });
}

function moveSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        eatSound.play();
        food = randomFoodPosition();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
        gameOver = true;
        gameOverSound.play();
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameOver = true;
            gameOverSound.play();
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = `Puntaje: ${score}`;
    if (score > maxScore) {
        maxScore = score;
        maxScoreDisplay.textContent = `Puntaje Máximo: ${maxScore}`;
        localStorage.setItem('maxScore', maxScore);
    }
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 4, canvas.height / 2);
        restartButton.classList.remove('hidden');
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    drawSnake();
    drawFood();
    drawObjects();
    updateScore();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -snakeSpeed };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: snakeSpeed };
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -snakeSpeed, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: snakeSpeed, y: 0 };
    }
});

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction.x === 0) {
            direction = { x: snakeSpeed, y: 0 };
        } else if (deltaX < 0 && direction.x === 0) {
            direction = { x: -snakeSpeed, y: 0 };
        }
    } else {
        if (deltaY > 0 && direction.y === 0) {
            direction = { x: 0, y: snakeSpeed };
        } else if (deltaY < 0 && direction.y === 0) {
            direction = { x: 0, y: -snakeSpeed };
        }
    }
}

restartButton.addEventListener('click', () => {
    initGame();
    setInterval(gameLoop, gameSpeed);
});

document.getElementById('easy').addEventListener('click', () => {
    gameSpeed = 200;
    snakeSpeed = 20;
    difficultySelected = true;
    startGame();
});

document.getElementById('medium').addEventListener('click', () => {
    gameSpeed = 100;
    snakeSpeed = 20;
    difficultySelected = true;
    startGame();
});

document.getElementById('hard').addEventListener('click', () => {
    gameSpeed = 50;
    snakeSpeed = 20;
    difficultySelected = true;
    startGame();
});

function startGame() {
    if (difficultySelected) {
        bgMusic.play();
        initGame();
        setInterval(gameLoop, gameSpeed);
    }
}
