export class Cell {
    constructor(pos) {
        this.pos = pos;
    }

    display(ctx, w, h, scale=1) {
        const xCenter = (this.pos.x+0.5) * w;
        const yCenter = (this.pos.y+0.5) * h;
        w *= scale;
        h *= scale;
        const x = xCenter - w*0.5;
        const y = yCenter - h*0.5;
        ctx.fillRect(x, y, w, h);
    }
}
