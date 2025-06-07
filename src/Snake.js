export class Cell {
    display(ctx, xCenter, yCenter, w, h) {
        const x = xCenter - w*0.5;
        const y = yCenter - h*0.5;
        ctx.fillRect(x, y, w, h);
    }
}

class SnakeCell extends Cell {
    pos = {x: undefined, y: undefined};

    constructor(pos) {
        super();
        this.pos = pos;
    }
    
    moveAbs(newPos) {
        this.pos = newPos
    }
    moveRel(grid, rel) {
        this.pos = grid.getCoordSum(this.pos, rel)
    }

    display(ctx, w, h) {
        const xCenter = (this.pos.x+0.5) * w;
        const yCenter = (this.pos.y+0.5) * h;
        ctx.fillStyle = "white"
        super.display(ctx, xCenter, yCenter, w, h)
    }
}

export class Snake {
    cells = []

    constructor(x, y, grid) {
        this.grid = grid;
        const head = new SnakeCell({x,y});
        this.cells.push(head);
    }

    get head() {
        return this.cells[0];
    }

    up() {
        this.head.moveRel(this.grid, {y:-1});
    }
    right() {
        this.head.moveRel(this.grid, {x: 1});
    }
    down() {
        this.head.moveRel(this.grid, {y: 1});
    }
    left() {
        this.head.moveRel(this.grid, {x:-1});
    }

    display() {
        const cellW = this.grid.cellW;
        const cellH = this.grid.cellH;
        this.cells.forEach(cell => cell.display(this.grid.ctx, cellW, cellH));
    }
}
