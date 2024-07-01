document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector('.red-button');

    button.addEventListener('click', function() {
        // Генерируем случайный цвет
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        document.body.style.backgroundColor = randomColor;

        // Список возможных анимаций
        const animations = ['spin', 'grow', 'fade', 'shift', 'gameOfLife'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

        // Удаляем предыдущие классы анимации
        button.classList.remove('spin', 'grow', 'fade', 'shift', 'gameOfLife');

        // Добавляем случайную анимацию
        button.classList.add(randomAnimation);

        // Запускаем эффект игры в жизнь, если выбран соответствующий эффект
        if (randomAnimation === 'gameOfLife') {
            startGameOfLife();
        }
    });
});
