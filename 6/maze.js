const canvas = document.getElementById('mazeCanvas');
        const ctx = canvas.getContext('2d');

        const cellSize = 20;
        const mazeWidth = canvas.width / cellSize;
        const mazeHeight = canvas.height / cellSize;
        let maze;

        function randomColor() {
            return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        }

        function createMaze() {
            maze = Array.from({ length: mazeHeight }, () => Array.from({ length: mazeWidth }, () => ({
                top: true,
                right: true,
                bottom: true,
                left: true,
                visited: false,
                color: randomColor()
            })));

            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function visit(x, y) {
                if (x < 0 || y < 0 || x >= mazeWidth || y >= mazeHeight) return;
                if (maze[y][x].visited) return;

                maze[y][x].visited = true;
                maze[y][x].color = 'grey';

                const directions = shuffle(['left', 'right', 'top', 'bottom']);

                for (const direction of directions) {
                    let nx = x, ny = y;
                    if (direction === 'left') nx--;
                    if (direction === 'right') nx++;
                    if (direction === 'top') ny--;
                    if (direction === 'bottom') ny++;

                    if (nx >= 0 && ny >= 0 && nx < mazeWidth && ny < mazeHeight && !maze[ny][nx].visited) {
                        if (direction === 'left') {
                            maze[y][x].left = false;
                            maze[ny][nx].right = false;
                        }
                        if (direction === 'right') {
                            maze[y][x].right = false;
                            maze[ny][nx].left = false;
                        }
                        if (direction === 'top') {
                            maze[y][x].top = false;
                            maze[ny][nx].bottom = false;
                        }
                        if (direction === 'bottom') {
                            maze[y][x].bottom = false;
                            maze[ny][nx].top = false;
                        }
                        visit(nx, ny);
                    }
                }
            }

            visit(Math.floor(Math.random() * mazeWidth), Math.floor(Math.random() * mazeHeight));
        }

        function drawMaze() {
            for (let y = 0; y < mazeHeight; y++) {
                for (let x = 0; x < mazeWidth; x++) {
                    const cell = maze[y][x];
                    ctx.fillStyle = cell.color;
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;

                    if (cell.top) {
                        ctx.beginPath();
                        ctx.moveTo(x * cellSize, y * cellSize);
                        ctx.lineTo((x + 1) * cellSize, y * cellSize);
                        ctx.stroke();
                    }
                    if (cell.right) {
                        ctx.beginPath();
                        ctx.moveTo((x + 1) * cellSize, y * cellSize);
                        ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                        ctx.stroke();
                    }
                    if (cell.bottom) {
                        ctx.beginPath();
                        ctx.moveTo(x * cellSize, (y + 1) * cellSize);
                        ctx.lineTo((x + 1) * cellSize, (y + 1) * cellSize);
                        ctx.stroke();
                    }
                    if (cell.left) {
                        ctx.beginPath();
                        ctx.moveTo(x * cellSize, y * cellSize);
                        ctx.lineTo(x * cellSize, (y + 1) * cellSize);
                        ctx.stroke();
                    }
                }
            }
        }

        createMaze();
        drawMaze();