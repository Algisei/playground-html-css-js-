// export const dataConsole = {
//     init() {
//         const consoleDiv = document.createElement('div');
//         consoleDiv.id = 'dataConsole';
//         consoleDiv.style.position = 'absolute';
//         consoleDiv.style.right = '0';
//         consoleDiv.style.top = '0';
//         consoleDiv.style.width = '200px';
//         consoleDiv.style.height = '100%';
//         consoleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
//         consoleDiv.style.color = 'white';
//         consoleDiv.style.overflow = 'auto';
//         consoleDiv.style.padding = '10px';
//         document.body.appendChild(consoleDiv);
//     },

//     update(data) {
//         const consoleDiv = document.getElementById('dataConsole');
//         consoleDiv.innerHTML = `
//             <div>Camera X: ${data.cameraX}</div>
//             <div>Camera Y: ${data.cameraY}</div>
//             <div>Units Count: ${data.unitsCount}</div>
//             <div>Selected Units Count: ${data.selectedUnitsCount}</div>
//             <div>Mouse X: ${data.mouseX}</div>
//             <div>Mouse Y: ${data.mouseY}</div>
//             <div>Camera Stopped: ${data.cameraStopped}</div>
//         `;
//     }
// };


export const dataConsole = {
    init() {
        this.console = document.createElement('div');
        this.console.style.position = 'absolute';
        this.console.style.top = '0';
        this.console.style.right = '0';
        this.console.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.console.style.color = 'white';
        this.console.style.padding = '10px';
        this.console.style.fontFamily = 'monospace';
        this.console.style.zIndex = '1000';
        this.console.style.width = '250px';
        this.console.style.maxHeight = '100vh';
        this.console.style.overflowY = 'auto';
        document.body.appendChild(this.console);
    },

    update(data) {
        this.console.innerHTML = `
            <div>
                Camera: (${data.cameraX.toFixed(2)}, ${data.cameraY.toFixed(2)})<br>
                Units: ${data.unitsCount}<br>
                Selected Units: ${data.selectedUnitsCount}<br>
                Mouse: (${data.mouseX}, ${data.mouseY})<br>
                Camera Stopped: ${data.cameraStopped}
            </div>
            <div style="display: flex; flex-wrap: wrap; margin-top: 10px;">
                ${data.selectedUnits.map(unit => `
                    <div style="border: 1px solid white; margin: 2px; padding: 5px; text-align: center;">
                        <canvas width="30" height="30" style="display: block; margin: auto;"></canvas>
                        <div>HP: ${unit.hp}</div>
                        <div>Shield: ${unit.shield}</div>
                        <div>Status: ${unit.status}</div>
                        <div>Type: ${unit.AllyFoeNeutral}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Рисуем миниатюры юнитов
        const canvases = this.console.querySelectorAll('canvas');
        canvases.forEach((canvas, index) => {
            const ctx = canvas.getContext('2d');
            const unit = data.selectedUnits[index];
            unit.draw(ctx);
        });
    }
};


