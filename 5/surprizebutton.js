document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    body.style.display = 'flex';
    body.style.justifyContent = 'center';
    body.style.alignItems = 'center';
    body.style.height = '100vh';
    body.style.margin = '0';
    body.style.fontFamily = 'Arial, sans-serif';

    const button = document.querySelector('.red-button');
    button.style.width = '200px';  // Увеличиваем ширину в 2 раза
    button.style.height = '200px'; // Увеличиваем высоту в 2 раза
    button.style.fontSize = '24px'; // Увеличиваем размер шрифта
    button.style.color = 'white';
    button.style.backgroundColor = 'red';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.transition = 'transform 0.1s ease'; // Добавляем плавный переход

    // Добавляем обработчик событий для анимации нажатия
    button.addEventListener('mousedown', function() {
        button.style.transform = 'scale(0.9)'; // Уменьшаем размер кнопки
    });

    button.addEventListener('mouseup', function() {
        button.style.transform = 'scale(1)'; // Восстанавливаем размер кнопки
    });

    button.addEventListener('mouseleave', function() {
        button.style.transform = 'scale(1)'; // Восстанавливаем размер кнопки при выходе мыши за пределы кнопки
    });
});
