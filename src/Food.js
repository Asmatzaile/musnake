import { Cell } from "./Cell";
import { randInt, choose } from "./utils";

export class Food extends Cell {

    static types = {
        NORMAL: { weight: 0.8, color: "white" },
        NIRVANA: { weight: 0.2, color: "red" },
    }


    constructor({pos, remove}) {
        super(pos);
        this.remove = remove;
        this.midinote = randInt(60, 72);
        const types = [...Object.keys(Food.types)];
        const weights = types.map(type=>Food.types[type].weight);
        this.type = choose(types, {weights});
    }

    display(ctx, w, h) {
        ctx.fillStyle = Food.types[this.type].color;
        super.display(ctx, w, h);
    }

    beEaten(snake) {
        if (this.type === "NIRVANA") snake.toggleNirvana();
        this.remove();
        document.dispatchEvent(new Event('foodEaten'));
    }
}
