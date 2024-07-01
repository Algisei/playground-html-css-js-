let canvas = document.getElementById('noisy-canvas'),
    ctx = canvas.getContext('2d');
function main() {
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    render();
}
function getRandom() {
    return Math.random() * 255;
}
function render() {
    let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < imageData.data.length; i += 12) {
        const color = getRandom();
        imageData.data[i]     = color
        imageData.data[i + 1] = color;
        imageData.data[i + 2] = color;
        imageData.data[i + 3] = 255;
        
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(render);
}
function updateCanvasSize() {
    ctx.canvas.height = canvas.offsetHeight;
    ctx.canvas.width  = canvas.offsetWidth;  
}
main();