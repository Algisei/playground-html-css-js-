export class Unit {
    constructor(x, y, color, shape,  size, speed,  hp, shield, status, shoot, AllyFoeNeutral, selected, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.shape = shape;
        this.size = size;
        this.speed = speed;
        this.hp = hp;
        this.shield = shield;
        this.status = status;
        this.shoot = shoot;
        this.AllyFoeNeutral = AllyFoeNeutral;
        
        this.selected = false;
        this.targetX = null;
        this.targetY = null;
    }

    moveToTarget() {
        if (this.targetX !== null && this.targetY !== null) {
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 1) {
                dx /= distance;
                dy /= distance;

                this.x += dx * this.speed;
                this.y += dy * this.speed;
            } else {
                this.targetX = null;
                this.targetY = null;
            }
        }
    }

    draw(ctx) {
        if (this.selected) {
            switch (this.AllyFoeNeutral) {
                case 'ally':
                    ctx.fillStyle = 'aquamarine';
                    break;
                case 'foe':
                    ctx.fillStyle = 'crimson';
                    break;
                case 'neutral':
                    ctx.fillStyle = 'rosybrown';
                    break;
            }
        } else {
            ctx.fillStyle = this.color;
        }
    
        switch (this.shape) {
            case 'square':
                ctx.fillRect(this.x, this.y, this.size, this.size);
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(this.x + this.size / 2, this.y);
                ctx.lineTo(this.x + this.size, this.y + this.size);
                ctx.lineTo(this.x, this.y + this.size);
                ctx.closePath();
                ctx.fill();
                break;
            case 'pentagon':
            case 'hexagon':
            case 'heptagon':
            case 'octagon':
            case 'nonagon':
            case 'decagon':
                this.drawPolygon(ctx, this.shape);
                break;
            default:
                console.warn(`Unknown shape: ${this.shape}`);
                break;
        }
    }
    

    drawPolygon(ctx, shape) {
        const sides = {
            pentagon: 5,
            hexagon: 6,
            heptagon: 7,
            octagon: 8,
            nonagon: 9,
            decagon: 10
        };
        const numSides = sides[shape];
        const angle = (2 * Math.PI) / numSides;
        const radius = this.size / 2;
        ctx.beginPath();
        for (let i = 0; i < numSides; i++) {
            const x = this.x + radius + radius * Math.cos(i * angle);
            const y = this.y + radius + radius * Math.sin(i * angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
    }
}
