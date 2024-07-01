import { Unit } from './Unit.js';
import { dataConsole } from './dataconsole.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Размер игрового поля
const fieldSize = {
    width: canvas.width * 5,
    height: canvas.height * 5
};

// Создание юнитов с разными свойствами
let units = [
    new Unit(100, 100, 'green', 'square', 50, 1),
    new Unit(200, 200, 'red', 'circle', 50, 2),
    new Unit(300, 300, 'yellow', 'square', 60, 1.5),
    new Unit(400, 400, 'blue', 'circle', 40, 1.2),
    new Unit(500, 500, 'purple', 'square', 70, 0.8)
];

const edgeThreshold = 50;
const scrollSpeed = 10;

let camera = { x: 0, y: 0 };

let selectionStart = null;
let selectionEnd = null;
let selectedUnits = [];
let isDragging = false;
let dragThreshold = 5;

let landscape = [];
let cameraStopped = false;

// Инициализация игры
function init() {
    generateLandscape();

    // Добавление обработчиков событий
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onRightClick);

    dataConsole.init();

    // Запуск игрового цикла
    gameLoop();
}

// Главный игровой цикл
function gameLoop() {
    // Очистка экрана
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновление состояния игры
    updateGame();

    // Отрисовка игрового мира
    drawWorld();

    // Обновление данных в консоли
    dataConsole.update({
        cameraX: camera.x,
        cameraY: camera.y,
        unitsCount: units.length,
        selectedUnitsCount: selectedUnits.length,
        mouseX: canvas.mouseX || 0,
        mouseY: canvas.mouseY || 0,
        cameraStopped: cameraStopped
    });

    // Запуск следующего кадра
    requestAnimationFrame(gameLoop);
}

// Генерация ландшафта
function generateLandscape() {
    for (let y = 0; y < fieldSize.height; y += 50) {
        for (let x = 0; x < fieldSize.width; x += 50) {
            const brownShade = Math.floor(Math.random() * 56) + 200;
            landscape.push({ x: x, y: y, color: `rgb(${brownShade}, ${brownShade - 50}, ${brownShade - 100})` });
        }
    }
}

// Функция для отрисовки игрового мира
function drawWorld() {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    landscape.forEach(tile => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, 50, 50);
    });

    units.forEach(unit => {
        unit.draw(ctx);
    });

    if (selectionStart && selectionEnd) {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            selectionStart.x,
            selectionStart.y,
            selectionEnd.x - selectionStart.x,
            selectionEnd.y - selectionStart.y
        );
    }

    ctx.restore();
}

// Функция для обновления состояния игры
function updateGame() {
    updateUnits();
    updateCamera();
}

// Обновление состояния юнитов
function updateUnits() {
    units.forEach(unit => unit.moveToTarget());
}

// Обновление состояния камеры
function updateCamera() {
    const mouseX = canvas.mouseX;
    const mouseY = canvas.mouseY;

    // Проверка, чтобы курсор находился внутри холста
    if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
        cameraStopped = false;

        // Проверка, чтобы курсор находился внутри игрового поля
        if (mouseX + camera.x >= 0 && mouseX + camera.x <= fieldSize.width &&
            mouseY + camera.y >= 0 && mouseY + camera.y <= fieldSize.height) {

            if (mouseX < edgeThreshold) {
                camera.x -= scrollSpeed;
            }
            if (mouseX > canvas.width - edgeThreshold) {
                camera.x += scrollSpeed;
            }
            if (mouseY < edgeThreshold) {
                camera.y -= scrollSpeed;
            }
            if (mouseY > canvas.height - edgeThreshold) {
                camera.y += scrollSpeed;
            }

            camera.x = Math.max(0, Math.min(camera.x, fieldSize.width - canvas.width));
            camera.y = Math.max(0, Math.min(camera.y, fieldSize.height - canvas.height));
        } else {
            // Остановка движения камеры, если курсор выходит за пределы игрового поля
            cameraStopped = true;
        }
    } else {
        // Остановка движения камеры, если курсор выходит за пределы холста
        cameraStopped = true;
    }
}

// Обработчик нажатия мыши
function onMouseDown(event) {
    const { mouseX, mouseY } = getMousePosition(event);

    if (event.button === 0) {
        selectionStart = { x: mouseX + camera.x, y: mouseY + camera.y };
        selectionEnd = null;
        isDragging = true;
    }
}

// Обработчик перемещения мыши
function onMouseMove(event) {
    const { mouseX, mouseY } = getMousePosition(event);
    canvas.mouseX = mouseX;
    canvas.mouseY = mouseY;

    if (isDragging && selectionStart) {
        if (!selectionEnd && Math.abs(mouseX + camera.x - selectionStart.x) < dragThreshold && Math.abs(mouseY + camera.y - selectionStart.y) < dragThreshold) {
            return;
        }

        selectionEnd = { x: mouseX + camera.x, y: mouseY + camera.y };
    }
}

// Обработчик отпускания мыши
function onMouseUp(event) {
    if (event.button === 0 && selectionStart) {
        if (selectionEnd && isDragging) {
            const { mouseX, mouseY } = getMousePosition(event);

            const minX = Math.min(selectionStart.x, selectionEnd.x);
            const minY = Math.min(selectionStart.y, selectionEnd.y);
            const maxX = Math.max(selectionStart.x, selectionEnd.x);
            const maxY = Math.max(selectionStart.y, selectionEnd.y);

            selectedUnits = units.filter(unit => {
                const selected = (
                    unit.x + unit.size > minX &&
                    unit.x < maxX &&
                    unit.y + unit.size > minY &&
                    unit.y < maxY
                );
                unit.selected = selected;
                return selected;
            });

        } else {
            const { mouseX, mouseY } = getMousePosition(event);

            let clickedOnUnit = false;
            units.forEach(unit => {
                if (mouseX + camera.x >= unit.x && mouseX + camera.x <= unit.x + unit.size &&
                    mouseY + camera.y >= unit.y && mouseY + camera.y <= unit.y + unit.size) {
                    units.forEach(u => u.selected = false);
                    unit.selected = true;
                    selectedUnits = [unit];
                    clickedOnUnit = true;
                }
            });

            if (!clickedOnUnit) {
                units.forEach(unit => unit.selected = false);
                selectedUnits = [];
            }
        }

        selectionStart = null;
        selectionEnd = null;
        isDragging = false;
    }
}

// Обработчик правой кнопки мыши
function onRightClick(event) {
    event.preventDefault();

    const { mouseX, mouseY } = getMousePosition(event);

    selectedUnits.forEach(unit => {
        unit.targetX = mouseX + camera.x - unit.size / 2;
        unit.targetY = mouseY + camera.y - unit.size / 2;
    });
}

// Получение позиции мыши
function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        mouseX: event.clientX - rect.left,
        mouseY: event.clientY - rect.top
    };
}

// Запуск игры
init();

import { dataConsole } from './dataconsole.js';
// import { Landscape } from './landscape.js';
// import { Unit } from './Unit.js';

// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');

// const fieldSize = {
//     width: canvas.width * 5,
//     height: canvas.height * 5
// };

// // Инициализация юнитов
// let units = [
//     new Unit(100, 100, 'green', 'square', 50 / 3, 2, 100, 50, 'idle', false, 'ally'),
//     new Unit(200, 200, 'red', 'circle', 50 / 3, 2, 80, 30, 'idle', false, 'foe'),
//     new Unit(300, 300, 'blue', 'triangle', 50 / 3, 2, 120, 40, 'idle', false, 'neutral'),
//     new Unit(400, 400, 'yellow', 'pentagon', 50 / 3, 2, 90, 20, 'idle', false, 'ally'),
//     new Unit(500, 500, 'purple', 'hexagon', 50 / 3, 2, 110, 60, 'idle', false, 'foe')
// ];

// const unitSize = 50;
// const collisionDistance = unitSize;
// const edgeThreshold = 50;
// const scrollSpeed = 10;

// let camera = { x: 0, y: 0 };

// let selectionStart = null;
// let selectionEnd = null;
// let selectedUnits = [];
// let isDragging = false;
// let dragThreshold = 5;

// let landscape = [];
// let cameraStopped = false;

// // Инициализация игры
// function init() {
//     landscape = Landscape.generate(fieldSize.width, fieldSize.height);

//     // Добавление обработчиков событий
//     canvas.addEventListener('mousedown', onMouseDown);
//     canvas.addEventListener('mousemove', onMouseMove);
//     canvas.addEventListener('mouseup', onMouseUp);
//     canvas.addEventListener('contextmenu', onRightClick);

//     dataConsole.init();

//     // Запуск игрового цикла
//     gameLoop();
// }

// // Главный игровой цикл
// function gameLoop() {
//     // Очистка экрана
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Обновление состояния игры
//     updateGame();

//     // Отрисовка игрового мира
//     drawWorld();

//     dataConsole.update({
//         cameraX: camera.x,
//         cameraY: camera.y,
//         unitsCount: units.length,
//         selectedUnitsCount: selectedUnits.length,
//         mouseX: canvas.mouseX || 0,
//         mouseY: canvas.mouseY || 0,
//         cameraStopped: cameraStopped,
//         selectedUnits: selectedUnits
//     });

//     // Запуск следующего кадра
//     requestAnimationFrame(gameLoop);
// }

// // Функция для отрисовки игрового мира
// function drawWorld() {
//     ctx.save();
//     ctx.translate(-camera.x, -camera.y);

//     landscape.forEach(tile => {
//         ctx.fillStyle = tile.color;
//         ctx.fillRect(tile.x, tile.y, Landscape.tileSize, Landscape.tileSize);
//     });

//     units.forEach(unit => {
//         unit.draw(ctx);
//     });

//     if (selectionStart && selectionEnd) {
//         ctx.strokeStyle = 'blue';
//         ctx.lineWidth = 1;
//         ctx.strokeRect(
//             selectionStart.x,
//             selectionStart.y,
//             selectionEnd.x - selectionStart.x,
//             selectionEnd.y - selectionStart.y
//         );
//     }

//     ctx.restore();
// }

// // Функция для обновления состояния игры
// function updateGame() {
//     updateUnits();
//     updateCamera();
// }

// function updateUnits() {
//     units.forEach(unit => {
//         unit.moveToTarget();

//         // Обработка коллизий
//         units.forEach(otherUnit => {
//             if (unit !== otherUnit) {
//                 const distX = unit.x - otherUnit.x;
//                 const distY = unit.y - otherUnit.y;
//                 const dist = Math.sqrt(distX * distX + distY * distY);

//                 if (dist < collisionDistance) {
//                     const overlap = (collisionDistance - dist) / 2;
//                     unit.x += (distX / dist) * overlap;
//                     unit.y += (distY / dist) * overlap;
//                     otherUnit.x -= (distX / dist) * overlap;
//                     otherUnit.y -= (distY / dist) * overlap;
//                 }
//             }
//         });
//     });
// }

// function updateCamera() {
//     const mouseX = canvas.mouseX;
//     const mouseY = canvas.mouseY;

//     if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
//         cameraStopped = false;

//         if (mouseX + camera.x >= 0 && mouseX + camera.x <= fieldSize.width &&
//             mouseY + camera.y >= 0 && mouseY + camera.y <= fieldSize.height) {

//             if (mouseX < edgeThreshold) {
//                 camera.x -= scrollSpeed;
//             }
//             if (mouseX > canvas.width - edgeThreshold) {
//                 camera.x += scrollSpeed;
//             }
//             if (mouseY < edgeThreshold) {
//                 camera.y -= scrollSpeed;
//             }
//             if (mouseY > canvas.height - edgeThreshold) {
//                 camera.y += scrollSpeed;
//             }

//             camera.x = Math.max(0, Math.min(camera.x, fieldSize.width - canvas.width));
//             camera.y = Math.max(0, Math.min(camera.y, fieldSize.height - canvas.height));
//         } else {
//             cameraStopped = true;
//         }
//     } else {
//         cameraStopped = true;
//     }
// }

// // Обработчик нажатия мыши
// function onMouseDown(event) {
//     const { mouseX, mouseY } = getMousePosition(event);

//     if (event.button === 0) {
//         selectionStart = { x: mouseX + camera.x, y: mouseY + camera.y };
//         selectionEnd = null;
//         isDragging = true;
//     }
// }

// // Обработчик перемещения мыши
// function onMouseMove(event) {
//     const { mouseX, mouseY } = getMousePosition(event);
//     canvas.mouseX = mouseX;
//     canvas.mouseY = mouseY;

//     if (isDragging && selectionStart) {
//         if (!selectionEnd && Math.abs(mouseX + camera.x - selectionStart.x) < dragThreshold && Math.abs(mouseY + camera.y - selectionStart.y) < dragThreshold) {
//             return;
//         }

//         selectionEnd = { x: mouseX + camera.x, y: mouseY + camera.y };
//     }
// }

// // Обработчик отпускания мыши
// function onMouseUp(event) {
//     if (event.button === 0 && selectionStart) {
//         if (selectionEnd && isDragging) {
//             const { mouseX, mouseY } = getMousePosition(event);

//             const minX = Math.min(selectionStart.x, selectionEnd.x);
//             const minY = Math.min(selectionStart.y, selectionEnd.y);
//             const maxX = Math.max(selectionStart.x, selectionEnd.x);
//             const maxY = Math.max(selectionStart.y, selectionEnd.y);

//             selectedUnits = units.filter(unit => {
//                 const selected = (
//                     unit.x + unit.size > minX &&
//                     unit.x < maxX &&
//                     unit.y + unit.size > minY &&
//                     unit.y < maxY
//                 );
//                 unit.selected = selected;
//                 return selected;
//             });

//         } else {
//             const { mouseX, mouseY } = getMousePosition(event);

//             let clickedOnUnit = false;
//             units.forEach(unit => {
//                 if (
//                     mouseX + camera.x >= unit.x &&
//                     mouseX + camera.x <= unit.x + unit.size &&
//                     mouseY + camera.y >= unit.y &&
//                     mouseY + camera.y <= unit.y + unit.size
//                 ) {
//                     unit.selected = true;
//                     clickedOnUnit = true;
//                     selectedUnits = [unit];
//                 } else {
//                     unit.selected = false;
//                 }
//             });

//             if (!clickedOnUnit) {
//                 selectedUnits = [];
//             }
//         }

//         selectionStart = null;
//         selectionEnd = null;
//         isDragging = false;
//     }
// }

// // Обработчик щелчка правой кнопкой мыши
// function onRightClick(event) {
//     event.preventDefault();

//     const { mouseX, mouseY } = getMousePosition(event);

//     selectedUnits.forEach(unit => {
//         unit.targetX = mouseX + camera.x;
//         unit.targetY = mouseY + camera.y;
//     });
// }

// // Функция для получения позиции мыши относительно canvas
// function getMousePosition(event) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//         mouseX: event.clientX - rect.left,
//         mouseY: event.clientY - rect.top
//     };
// }

// // Запуск игры
// init();
