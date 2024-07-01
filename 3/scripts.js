document.addEventListener('DOMContentLoaded', () => {
    const cube = document.querySelector('.cube');
    const playerSphere = document.querySelector('.player-sphere');
    const scene = document.querySelector('.scene');
    const obstacleSize = 100;
    const sphereSize = 20;
    const maxObstacles = 5;
    let x = 0;
    let y = 0;
    let perspective = 1800;
    const perspectiveStep = 150;
    let isDragging = false;
    let startX, startY;
    let playerX = 0;
    let playerY = 0;
    let playerZ = 0;
    const moveStep = 30;
    const maxMove = 240;
    const obstacles = [];

    // Create the circles for the player sphere
    for (let i = 0; i < 10; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        playerSphere.appendChild(circle);
    }

    // Generate obstacles
    for (let i = 0; i < maxObstacles; i++) {
        const obstacle = createObstacle();
        placeObstacle(obstacle);
        cube.appendChild(obstacle);
        obstacles.push(obstacle);
    }

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';

        const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
        faces.forEach(faceClass => {
            const face = document.createElement('div');
            face.className = `face ${faceClass}`;
            obstacle.appendChild(face);
        });

        return obstacle;
    }

    function placeObstacle(obstacle) {
        let isValidPosition = false;
        while (!isValidPosition) {
            const posX = getRandomPosition();
            const posY = getRandomPosition();
            const posZ = getRandomPosition();
            isValidPosition = true;

            // Check collision with other obstacles
            for (let other of obstacles) {
                const otherPos = getTransformValues(other.style.transform);
                if (getDistance(posX, posY, posZ, otherPos.x, otherPos.y, otherPos.z) < obstacleSize * 1.5) {
                    isValidPosition = false;
                    break;
                }
            }

            // Check collision with sphere starting position
            if (isValidPosition && getDistance(posX, posY, posZ, playerX, playerY, playerZ) < obstacleSize + sphereSize * 1.5) {
                isValidPosition = false;
            }

            if (isValidPosition) {
                obstacle.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;
            }
        }
    }

    function getRandomPosition() {
        return Math.floor(Math.random() * (maxMove * 2 + 1)) - maxMove;
    }

    function getTransformValues(transform) {
        const values = transform.match(/translate3d\(([^)]+)\)/)[1].split(', ').map(v => parseFloat(v));
        return { x: values[0], y: values[1], z: values[2] };
    }

    function getDistance(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    }

    function checkCollision(x, y, z) {
        // Check collision with cube boundaries
        if (x < -maxMove || x > maxMove || y < -maxMove || y > maxMove || z < -maxMove || z > maxMove) {
            return true;
        }
        
        // Check collision with obstacles
        for (let obstacle of obstacles) {
            const pos = getTransformValues(obstacle.style.transform);
            if (getDistance(x, y, z, pos.x, pos.y, pos.z) < obstacleSize / 2 + sphereSize / 2) {
                return true;
            }
        }
        return false;
    }

    // Handle keyboard rotation and perspective change
    document.addEventListener('keydown', (event) => {
        let newX = playerX;
        let newY = playerY;
        let newZ = playerZ;

        switch (event.key) {
            case 'ArrowUp':
                x -= 90;
                break;
            case 'ArrowDown':
                x += 90;
                break;
            case 'ArrowLeft':
                y -= 90;
                break;
            case 'ArrowRight':
                y += 90;
                break;
            case '+':
                perspective = Math.max(60, perspective - perspectiveStep);
                break;
            case '-':
                perspective = Math.min(3600, perspective + perspectiveStep);
                break;
            case 'w':
                newZ -= moveStep;
                break;
            case 's':
                newZ += moveStep;
                break;
            case 'a':
                newX -= moveStep;
                break;
            case 'd':
                newX += moveStep;
                break;
            case 'q':
                newY -= moveStep;
                break;
            case 'e':
                newY += moveStep;
                break;
            case 'r':
                perspective = 1800;
                x = 0;
                y = 0;
                playerX = 0;
                playerY = 0;
                playerZ = 0;
                break;
        }

        if (!checkCollision(newX, newY, newZ)) {
            playerX = newX;
            playerY = newY;
            playerZ = newZ;
        }

        updateTransform();
    });

    // Handle mouse rotation
    scene.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        cube.style.transition = 'none';
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            y += dx * 0.5;
            x -= dy * 0.5;
            updateTransform();
            startX = event.clientX;
            startY = event.clientY;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            cube.style.transition = 'transform 0.5s';
        }
    });

    // Handle mouse wheel for zoom
    document.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            perspective = Math.max(60, perspective - perspectiveStep);
        } else {
            perspective = Math.min(3600, perspective + perspectiveStep);
        }
        updateTransform();
    });

    // Handle transparency toggle
    document.querySelectorAll('.face').forEach(face => {
        face.style.opacity = 1;
        face.addEventListener('click', (event) => {
            if (event.altKey) {
                let currentOpacity = parseFloat(face.style.opacity);
                if (currentOpacity === 1) {
                    face.style.opacity = 0.5;
                } else if (currentOpacity === 0.5) {
                    face.style.opacity = 0;
                } else {
                    face.style.opacity = 1;
                }
            }
        });
    });

    function updateTransform() {
        scene.style.perspective = `${perspective}px`;
        cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
        playerSphere.style.transform = `translate3d(${playerX}px, ${playerY}px, ${playerZ}px)`;
    }
});
