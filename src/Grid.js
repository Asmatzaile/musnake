import { posMod } from "./utils";

import { Snake } from "./Snake";

export class Grid {
    cols = 32;
    rows = 24;

    constructor(ctx) {
        this.ctx = ctx;
        this.snake = new Snake(this.cols/2, this.rows/2, this);
    }
    
    display() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.snake.display();
    }

    getCoordSum({x: x0, y: y0}, {x:x1=0, y:y1=0}) {
        return this.moduloCoords({x: x0+x1, y: y0+y1});
    }

    moduloCoords({x, y}) {
        return {x: posMod(x, this.cols), y: posMod(y, this.rows)}
    }

    get cellW() {
        return this.ctx.canvas.width / this.cols;
    }
    get cellH() {
        return this.ctx.canvas.height / this.rows;
    }

}
