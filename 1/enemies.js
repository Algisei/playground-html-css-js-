// enemies.js
export const enemies = [];
const enemySpeed = 2;
const spawnInterval = 1000; // Interval in ms to spawn new enemies
let gameContainer;
let getPlayerX;
let getPlayerY;

export function initEnemies(container, getX, getY) {
    gameContainer = container;
    getPlayerX = getX;
    getPlayerY = getY;
    setInterval(spawnEnemy, spawnInterval);
}

export function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    gameContainer.appendChild(enemy);

    let enemyX, enemyY;
    do {
        enemyX = Math.random() * gameContainer.clientWidth;
        enemyY = Math.random() * gameContainer.clientHeight;
    } while (Math.abs(enemyX - getPlayerX()) < 100 && Math.abs(enemyY - getPlayerY()) < 100);

    enemy.style.left = `${enemyX}px`;
    enemy.style.top = `${enemyY}px`;

    enemies.push({ element: enemy, x: enemyX, y: enemyY });
}

export function updateEnemies() {
    enemies.forEach((enemy, index) => {
        const angle = Math.atan2(getPlayerY() - enemy.y, getPlayerX() - enemy.x);
        enemy.x += enemySpeed * Math.cos(angle);
        enemy.y += enemySpeed * Math.sin(angle);

        enemy.element.style.left = `${enemy.x}px`;
        enemy.element.style.top = `${enemy.y}px`;

        // Remove enemy if it collides with the player (optional, based on game logic)
        if (isColliding(enemy, { element: document.getElementById('player'), x: getPlayerX(), y: getPlayerY() })) {
            enemy.element.remove();
            enemies.splice(index, 1);
        }
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
