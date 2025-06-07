import { Cell } from "./Cell";

export class Food extends Cell {

    constructor(pos, remove) {
        super(pos);
        this.remove = remove;
    }

    moveAbs(newPos) {
        this.pos = newPos
    }
    moveRel(grid, rel) {
        this.pos = grid.getCoordSum(this.pos, rel)
    }

    display(ctx, w, h) {
        ctx.fillStyle = "white";
        super.display(ctx, w, h);
    }

    beEaten() {
        this.remove();
        document.dispatchEvent(new Event('foodEaten'));
    }
}
