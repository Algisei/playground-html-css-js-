export const Landscape = {
    tileSize: 50 / 3,
    noiseScale: 0.01,  // Уменьшение шкалы шума для более плавных переходов

    generate(width, height) {
        const tiles = [];
        const noise = this.generatePerlinNoise(width, height);

        for (let y = 0; y < height; y += this.tileSize) {
            for (let x = 0; x < width; x += this.tileSize) {
                const noiseValue = noise[Math.floor(y / this.tileSize)][Math.floor(x / this.tileSize)];
                const color = this.noiseToColor(noiseValue);
                tiles.push({ x, y, color });
            }
        }
        return tiles;
    },

    generatePerlinNoise(width, height) {
        const noise = [];
        for (let y = 0; y < height / this.tileSize; y++) {
            noise[y] = [];
            for (let x = 0; x < width / this.tileSize; x++) {
                noise[y][x] = Math.random();
            }
        }

        // Перлиновское сглаживание
        for (let y = 0; y < height / this.tileSize; y++) {
            for (let x = 0; x < width / this.tileSize; x++) {
                const corners = (this.getNoise(noise, x - 1, y - 1) + this.getNoise(noise, x + 1, y - 1) + this.getNoise(noise, x - 1, y + 1) + this.getNoise(noise, x + 1, y + 1)) / 16;
                const sides = (this.getNoise(noise, x - 1, y) + this.getNoise(noise, x + 1, y) + this.getNoise(noise, x, y - 1) + this.getNoise(noise, x, y + 1)) / 8;
                const center = this.getNoise(noise, x, y) / 4;

                noise[y][x] = corners + sides + center;
            }
        }

        return noise;
    },

    getNoise(noise, x, y) {
        if (x < 0 || y < 0 || x >= noise[0].length || y >= noise.length) {
            return 0;
        }
        return noise[y][x];
    },

    noiseToColor(noiseValue) {
        if (noiseValue < 0.3) {
            const blueShade = Math.floor(200 + noiseValue * 55);
            return `rgb(0, 0, ${blueShade})`;
        } else if (noiseValue < 0.6) {
            const greenShade = Math.floor(100 + noiseValue * 155);
            return `rgb(0, ${greenShade}, 0)`;
        } else {
            const grayShade = Math.floor(200 + noiseValue * 55);
            return `rgb(${grayShade}, ${grayShade}, ${grayShade})`;
        }
    }
};




// export class Landscape {
//     static tileSize = 50 / 3;

//     static generate(width, height) {
//         const tiles = [];
//         const cols = Math.ceil(width / Landscape.tileSize);
//         const rows = Math.ceil(height / Landscape.tileSize);
//         const noiseScale = 100;

//         for (let x = 0; x < cols; x++) {
//             for (let y = 0; y < rows; y++) {
//                 const noiseValue = Math.abs(2 * (Math.random() - 0.5)); // Временная генерация шума
//                 let color;

//                 if (noiseValue < 0.3) {
//                     color = '#8B4513'; // Суша
//                 } else if (noiseValue < 0.6) {
//                     color = '#A0522D'; // Низины
//                 } else {
//                     color = '#D2B48C'; // Высоты
//                 }

//                 tiles.push({
//                     x: x * Landscape.tileSize,
//                     y: y * Landscape.tileSize,
//                     color
//                 });
//             }
//         }

//         return tiles;
//     }
// }
