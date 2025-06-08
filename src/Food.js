import { Cell } from "./Cell";
import { randInt } from "./utils";

export class Food extends Cell {

    constructor(pos, remove) {
        super(pos);
        this.remove = remove;
        this.midinote = randInt(60, 72);
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
