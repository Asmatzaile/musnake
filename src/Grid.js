import { posMod, choose } from "./utils";
import { Snake } from "./Snake";
import { Food } from "./Food";

export class Grid {
    cols = 32;
    rows = 24;
    items = new Set();

    constructor(ctx) {
        this.ctx = ctx;
        this.snake = new Snake(this.cols/2, this.rows/2, this);
        this.makeFood();
        document.addEventListener('foodEaten', () => this.onFoodEaten());
    }

    update(audiotime) {
        this.snake.step(audiotime);
    }
    
    display() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        const cellW = this.cellW;
        const cellH = this.cellH;
        this.snake.display(this.ctx);
        this.items.forEach(item=>{
            item.display(this.ctx, cellW, cellH)}
        )

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

    getFilledPositions() {
        const filledPositions = new Set();
        this.snake.cells.forEach(cell=> filledPositions.add(cell.pos));
        this.items.forEach(item => filledPositions.add(item.pos));
        return filledPositions;
    }

    getAvailablePositions() {
        const filledPositions = this.getFilledPositions();
        const filledPosStrings = new Set(Array.from(filledPositions).map(({x, y})=> `x${x}y${y}`));
        const availablePositions = new Set();
        for (let y = 0; y < this.rows; y++) for (let x = 0; x < this.cols; x++) {
            if (!filledPosStrings.has(`x${x}y${y}`)) availablePositions.add({x, y});
        }
        return availablePositions;
    }

    getRandomEmptyPos() {
        return choose(Array.from(this.getAvailablePositions()));
    }

    getItemAtPos({x, y}) {
        return Array.from(this.items).find(el => el.pos.x === x && el.pos.y === y);
    }


    makeFood() {
        const remove = () => this.items.delete(food);
        const food = new Food(this.getRandomEmptyPos(), remove);
        this.items.add(food);
    }
    onFoodEaten() {
        this.makeFood();
    }
}
