// script.js
import { initEnemies, updateEnemies, enemies } from './enemies.js';

document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');

    let playerX = window.innerWidth / 2;
    let playerY = window.innerHeight / 2;
    const playerSpeed = 5;
    const bulletSpeed = 10;
    const bullets = [];
    const keys = {};

    function updatePlayerPosition() {
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }

    function handleKeyDown(event) {
        keys[event.key] = true;
    }

    function handleKeyUp(event) {
        keys[event.key] = false;
    }

    function movePlayer() {
        if (keys['w']) playerY -= playerSpeed;
        if (keys['s']) playerY += playerSpeed;
        if (keys['a']) playerX -= playerSpeed;
        if (keys['d']) playerX += playerSpeed;

        // Ensure the player stays within the bounds of the game container
        playerX = Math.max(0, Math.min(playerX, gameContainer.clientWidth - player.clientWidth));
        playerY = Math.max(0, Math.min(playerY, gameContainer.clientHeight - player.clientHeight));

        updatePlayerPosition();
    }

    function shootBullet(targetX, targetY) {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        gameContainer.appendChild(bullet);

        const startX = playerX + player.clientWidth / 2;
        const startY = playerY + player.clientHeight / 2;
        const angle = Math.atan2(targetY - startY, targetX - startX);

        bullet.style.left = `${startX}px`;
        bullet.style.top = `${startY}px`;

        const velocityX = bulletSpeed * Math.cos(angle);
        const velocityY = bulletSpeed * Math.sin(angle);

        bullets.push({ element: bullet, x: startX, y: startY, velocityX, velocityY });
    }

    function updateBullets() {
        bullets.forEach((bullet, bulletIndex) => {
            bullet.x += Math.sin(bullet.velocityX);
            bullet.y += Math.sin(bullet.velocityY);
            bullet.element.style.left = `${bullet.x}px`;
            bullet.element.style.top = `${bullet.y}px`;

            // Remove bullet if it goes out of bounds
            if (bullet.x < 0 || bullet.x > gameContainer.clientWidth || bullet.y < 0 || bullet.y > gameContainer.clientHeight) {
                bullet.element.remove();
                bullets.splice(bulletIndex, 1);
                return;
            }

            // Check for collision with enemies
            enemies.forEach((enemy, enemyIndex) => {
                if (isColliding(bullet, enemy)) {
                    bullet.element.remove();
                    enemy.element.remove();
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(enemyIndex, 1);
                }
            });
        });
    }

    function isColliding(obj1, obj2) {
        const rect1 = obj1.element.getBoundingClientRect();
        const rect2 = obj2.element.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }

    function gameLoop() {
        movePlayer();
        updateBullets();
        updateEnemies();
        requestAnimationFrame(gameLoop);
    }

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            shootBullet(mouseX, mouseY);
        } else {
            handleKeyDown(event);
        }
    });

    document.addEventListener('keyup', handleKeyUp);

    updatePlayerPosition();
    initEnemies(gameContainer, () => playerX, () => playerY); // Initialize enemies with game container and player position
    gameLoop();
});