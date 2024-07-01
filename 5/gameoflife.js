function createGrid(rows, cols) {
    const grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            grid[row][col] = Math.floor(Math.random() * 2);
        }
    }
    return grid;
}

function drawGrid(grid, canvas, ctx) {
    const cellSize = 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}

function updateGrid(grid) {
    const newGrid = grid.map(arr => [...arr]);

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1) {
                if (neighbors < 2 || neighbors > 3) {
                    newGrid[row][col] = 0;
                }
            } else {
                if (neighbors === 3) {
                    newGrid[row][col] = 1;
                }
            }
        }
    }

    return newGrid;
}

function countNeighbors(grid, row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    return directions.reduce((acc, [x, y]) => {
        const newRow = row + x;
        const newCol = col + y;
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[row].length) {
            acc += grid[newRow][newCol];
        }
        return acc;
    }, 0);
}

function startGameOfLife() {
    let grid = createGrid(60, 60);
    const canvas = document.createElement('canvas');
    canvas.className = 'game-of-life-canvas';
    document.body.appendChild(canvas);
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    function update() {
        grid = updateGrid(grid);
        drawGrid(grid, canvas, ctx);
    }

    drawGrid(grid, canvas, ctx);
    setInterval(update, 100);
}
