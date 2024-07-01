document.addEventListener('DOMContentLoaded', () => {
    const cube = document.querySelector('.cube');

    const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
    faces.forEach(face => {
        const obstacleArea = document.createElement('div');
        obstacleArea.className = `obstacle-area ${face}`;
        cube.appendChild(obstacleArea);
    });
});
