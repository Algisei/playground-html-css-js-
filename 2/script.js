// script.js
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const elementsContainer = document.getElementById('elements-container');
const wallsContainer = document.getElementById('walls-container');

const playerSpeed = 5;
const numElements = 2;
const numWalls = 10;
const minDistanceFromPlayer = 60; // Минимальное расстояние от центра игрока до стены
const elements = [];
const walls = [];
let keys = {};

// Генерация случайных элементов
function createRandomElements() {
    for (let i = 0; i < numElements; i++) {
        const element = document.createElement('div');
        element.className = 'element';
        element.style.top = `${Math.random() * 100}vh`;
        element.style.left = `${Math.random() * 100}vw`;
        elementsContainer.appendChild(element);
        elements.push(element);
    }
}

// Генерация случайных стен-препятствий
function createRandomWalls() {
    for (let i = 0; i < numWalls; i++) {
        const wall = document.createElement('div');
        wall.className = 'wall';

        let top, left, width, height;
        let isTooClose;

        do {
            width = `${20 + Math.random() * 180}px`;
            height = `${20 + Math.random() * 180}px`;
            top = Math.random() * 100;
            left = Math.random() * 100;

            const playerRect = player.getBoundingClientRect();
            const wallCenterX = left / 100 * gameContainer.clientWidth + parseFloat(width) / 2;
            const wallCenterY = top / 100 * gameContainer.clientHeight + parseFloat(height) / 2;
            const playerCenterX = playerRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top + playerRect.height / 2;

            const distance = Math.sqrt((wallCenterX - playerCenterX) ** 2 + (wallCenterY - playerCenterY) ** 2);

            isTooClose = distance < minDistanceFromPlayer;
        } while (isTooClose);

        wall.style.top = `${top}vh`;
        wall.style.left = `${left}vw`;
        wall.style.width = width;
        wall.style.height = height;

        wallsContainer.appendChild(wall);
        walls.push(wall);
    }
}

// Проверка столкновений с стенами
function checkCollision(newTop, newLeft) {
    const playerRect = {
        top: newTop,
        left: newLeft,
        bottom: newTop + player.clientHeight,
        right: newLeft + player.clientWidth
    };

    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        if (
            playerRect.right > wallRect.left &&
            playerRect.left < wallRect.right &&
            playerRect.bottom > wallRect.top &&
            playerRect.top < wallRect.bottom
        ) {
            return true;
        }
    }

    return false;
}

// Перемещение игрока
function movePlayer() {
    const playerRect = player.getBoundingClientRect();
    let newTop = player.offsetTop;
    let newLeft = player.offsetLeft;

    if (keys['ArrowUp']) {
        newTop -= playerSpeed;
        if (checkCollision(newTop, newLeft)) {
            newTop += playerSpeed;
        }
    }
    if (keys['ArrowDown']) {
        newTop += playerSpeed;
        if (checkCollision(newTop, newLeft)) {
            newTop -= playerSpeed;
        }
    }
    if (keys['ArrowLeft']) {
        newLeft -= playerSpeed;
        if (checkCollision(newTop, newLeft)) {
            newLeft += playerSpeed;
        }
    }
    if (keys['ArrowRight']) {
        newLeft += playerSpeed;
        if (checkCollision(newTop, newLeft)) {
            newLeft -= playerSpeed;
        }
    }

    // Ограничение движения в пределах контейнера
    const maxTop = gameContainer.clientHeight - player.clientHeight;
    const maxLeft = gameContainer.clientWidth - player.clientWidth;

    newTop = Math.max(0, Math.min(newTop, maxTop));
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));

    player.style.top = `${newTop}px`;
    player.style.left = `${newLeft}px`;

    requestAnimationFrame(movePlayer);
}

// Обработка нажатий клавиш
function handleKeyDown(event) {
    keys[event.key] = true;
}

function handleKeyUp(event) {
    keys[event.key] = false;
}

// Инициализация игры
function initGame() {
    createRandomElements();
    createRandomWalls();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    movePlayer();
}

document.addEventListener('DOMContentLoaded', initGame);
