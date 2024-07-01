import { dataConsole } from './dataconsole.js';
import { Landscape } from './landscape.js';
import { Unit } from './Unit.js';
import { CommandCenter } from './CommandCenter.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const fieldSize = {
    width: canvas.width * 5,
    height: canvas.height * 5
};

// Инициализация юнитов
let units = [
    new Unit(100, 100, 'green', 'square', 50 / 3, 2, 100, 50, 'idle', false, 'ally'),
    new Unit(200, 200, 'orange', 'circle', 50 / 3, 2, 80, 30, 'idle', false, 'foe'),
    new Unit(300, 300, 'black', 'triangle', 50 / 3, 2, 120, 40, 'idle', false, 'neutral'),
    new Unit(400, 400, 'yellow', 'pentagon', 50 / 3, 2, 90, 20, 'idle', false, 'ally'),
    new Unit(500, 500, 'purple', 'hexagon', 50 / 3, 2, 110, 60, 'idle', false, 'foe')
];

const unitSize = 50;
const collisionDistance = unitSize;
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

//Инициализация размецения
let placementMode = null;
let placementShape = null;
let placementColor = null;
let placementSize = null;

function setPlacementMode(shape, color, size) {
    placementMode = true;
    placementShape = shape;
    placementColor = color;
    placementSize = size * unitSize; // 4 tiles
}

// Draw placement shape
function drawPlacementShape(ctx, x, y, shape, color, size) {
    ctx.fillStyle = color;
    ctx.beginPath();
    switch (shape) {
        case 'circle':
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            break;
        case 'square':
            ctx.rect(x - size / 2, y - size / 2, size, size);
            break;
        case 'triangle':
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x + size / 2, y + size / 2);
            ctx.lineTo(x - size / 2, y + size / 2);
            break;
        case 'octagon':
            drawPolygon(ctx, x, y, 8, size / 2);
            break;
        default:
            break;
    }
    ctx.closePath();
    ctx.fill();
}

// Draw polygon
function drawPolygon(ctx, x, y, sides, radius) {
    const angle = (2 * Math.PI) / sides;
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    for (let i = 1; i < sides; i++) {
        ctx.lineTo(x + radius * Math.cos(i * angle), y + radius * Math.sin(i * angle));
    }
    ctx.lineTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
}

// Инициализация игры
function init() {
    landscape = Landscape.generate(fieldSize.width, fieldSize.height);
    const commandCenter = new CommandCenter('commandCenterContainer', { setPlacementMode });
    // Добавление обработчиков событий
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onRightClick);
    canvas.addEventListener('click', onCanvasClick);

    dataConsole.init();

    // Запуск игрового цикла
    gameLoop();
}

// Canvas click handler
function onCanvasClick(event) {
    if (placementMode) {
        const { mouseX, mouseY } = getMousePosition(event);
        drawPlacementShape(ctx, mouseX + camera.x, mouseY + camera.y, placementShape, placementColor, placementSize);
        placementMode = null;
    }
}

// Главный игровой цикл
function gameLoop() {
    // Очистка экрана
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обновление состояния игры
    updateGame();

    // Отрисовка игрового мира
    drawWorld();

    dataConsole.update({
        cameraX: camera.x,
        cameraY: camera.y,
        unitsCount: units.length,
        selectedUnitsCount: selectedUnits.length,
        mouseX: canvas.mouseX || 0,
        mouseY: canvas.mouseY || 0,
        cameraStopped: cameraStopped,
        selectedUnits: selectedUnits
    });

    // Запуск следующего кадра
    requestAnimationFrame(gameLoop);
}

// Функция для отрисовки игрового мира
function drawWorld() {
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    landscape.forEach(tile => {
        ctx.fillStyle = tile.color;
        ctx.fillRect(tile.x, tile.y, Landscape.tileSize, Landscape.tileSize);
    });

    units.forEach(unit => {
        unit.draw(ctx);
    });

    if (selectionStart && selectionEnd) {
        ctx.strokeStyle = 'magenta';
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

function updateUnits() {
    units.forEach(unit => {
        unit.moveToTarget();

        // Обработка коллизий
        units.forEach(otherUnit => {
            if (unit !== otherUnit) {
                const distX = unit.x - otherUnit.x;
                const distY = unit.y - otherUnit.y;
                const dist = Math.sqrt(distX * distX + distY * distY);

                if (dist < collisionDistance) {
                    const overlap = (collisionDistance - dist) / 2;
                    unit.x += (distX / dist) * overlap;
                    unit.y += (distY / dist) * overlap;
                    otherUnit.x -= (distX / dist) * overlap;
                    otherUnit.y -= (distY / dist) * overlap;
                }
            }
        });
    });
}

function updateCamera() {
    const mouseX = canvas.mouseX;
    const mouseY = canvas.mouseY;

    if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
        cameraStopped = false;

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
            cameraStopped = true;
        }
    } else {
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
        if (!selectionEnd && Math.abs(mouseX + camera.x - selectionStart.x) < dragThreshold && 
            Math.abs(mouseY + camera.y - selectionStart.y) < dragThreshold) {
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
                const unitCenterX = unit.x + unit.size / 2;
                const unitCenterY = unit.y + unit.size / 2;
                return unitCenterX >= minX && unitCenterX <= maxX && unitCenterY >= minY && unitCenterY <= maxY;
            });

            selectedUnits.forEach(unit => unit.selected = true);
        } else {
            const { mouseX, mouseY } = getMousePosition(event);
            let clickedOnUnit = false;

            units.forEach(unit => {
                if (
                    mouseX + camera.x >= unit.x &&
                    mouseX + camera.x <= unit.x + unit.size &&
                    mouseY + camera.y >= unit.y &&
                    mouseY + camera.y <= unit.y + unit.size
                ) {
                    unit.selected = true;
                    clickedOnUnit = true;
                    selectedUnits = [unit];
                } else {
                    unit.selected = false;
                }
            });

            if (!clickedOnUnit) {
                selectedUnits = [];
            }
        }

        selectionStart = null;
        selectionEnd = null;
        isDragging = false;
        console.log(
            'selectedUnits ',selectedUnits,'\n',
            'selectionStart ',selectionStart,
            'selectionEnd ',selectionEnd,'\n',
            'isDragging ',isDragging,'\n',
            'units ',units
        );
    }
}

// Обработчик щелчка правой кнопкой мыши
function onRightClick(event) {
    event.preventDefault();

    const { mouseX, mouseY } = getMousePosition(event);

    selectedUnits.forEach(unit => {
        unit.targetX = mouseX + camera.x;
        unit.targetY = mouseY + camera.y;
    });
}

// Функция для получения позиции мыши относительно canvas
function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        mouseX: event.clientX - rect.left,
        mouseY: event.clientY - rect.top
    };
}



// Запуск игры
init();
