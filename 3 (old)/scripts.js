document.addEventListener('DOMContentLoaded', () => {
    const cube = document.querySelector('.cube');
    let x = 0;
    let y = 0;
    let scale = 1;
    const scaleStep = 0.1;
    let isDragging = false;
    let startX, startY;

    // Handle keyboard rotation
    document.addEventListener('keydown', (event) => {
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
                scale = Math.min(2, scale + scaleStep); // Limit max scale to 2
                break;
            case '-':
                scale = Math.max(0.1, scale - scaleStep); // Limit min scale to 0.1
                break;
        }
        updateTransform();
    });

    // Handle mouse rotation
    const scene = document.querySelector('.scene');

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
        if (event.ctrlKey) {
            event.preventDefault();
            if (event.deltaY < 0) {
                scale = Math.min(2, scale + scaleStep); // Limit max scale to 2
            } else {
                scale = Math.max(0.1, scale - scaleStep); // Limit min scale to 0.1
            }
            updateTransform();
        }
    });

    // Handle transparency toggle
    document.querySelectorAll('.face').forEach(face => {
        face.style.opacity = 1; // Set initial opacity to 1
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
        cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg) scale(${scale})`;
    }
});
