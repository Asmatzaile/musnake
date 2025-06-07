import { Cell } from "./Cell";

class SnakeCell extends Cell {

    moveAbs(newPos) {
        if (this.previousCell) this.previousCell.moveAbs(this.pos);
        if (this.stomachContents) {
            if (this.previousCell) this.previousCell.stomachContents = this.stomachContents;
            else this.previousCell = new SnakeCell(this.pos)
            this.stomachContents = undefined;
        }
        this.pos = newPos;
    }
    moveRel(grid, rel) {
        const newPos = grid.getCoordSum(this.pos, rel);
        this.moveAbs(newPos);
    }

    display(ctx, w, h) {
        ctx.fillStyle = "white"
        const scale = this.stomachContents ? 1.2 : 1;
        super.display(ctx, w, h, scale)
    }
}

export class Snake {
    _direction = {x: 0, y: -1};
    directionQueue = [];

    set direction({x=0, y=0}) {
        const lastDirection = this.directionQueue[this.directionQueue.length-1] ?? this._direction;
        const xChange = Math.abs(x-lastDirection.x);
        const yChange = Math.abs(y-lastDirection.y);
        const isValid = xChange+yChange !== 0 && ((xChange < 2 && yChange < 2) || this.length === 1)
        if (isValid) this.directionQueue.push({x,  y});
    }

    constructor(x, y, grid) {
        this.grid = grid;
        this.head = new SnakeCell({x,y});
    }

    get cells() {
        const cells = [this.head];
        let current = this.head;
        while(current.previousCell) {
            current = current.previousCell;
            cells.push(current);
        };
        return cells;
    }

    get length() {
        return this.cells.length;
    }

    step() {
        this._direction = this.directionQueue.shift() ?? this._direction;
        this.head.moveRel(this.grid, this._direction);
        const item = this.grid.getItemAtPos(this.head.pos);
        if (item) this.eat(item);
    }

    eat(food) {
        this.head.stomachContents = food;
        food.beEaten();
    }

    display(ctx) {
        const cellW = this.grid.cellW;
        const cellH = this.grid.cellH;
        this.cells.forEach(cell => cell.display(ctx, cellW, cellH));
    }
}
