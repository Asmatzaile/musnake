
import { Player } from 'tone';
import { Sequence } from './Sequence';
import samples from "./samples.json"
import { choose } from './utils';

export class Drum {
    bank = "RolandTR808";

    static type = {
        BASS: ["bd", "lt"],
        MID: ["cp", "sd", "ht"],
    }
    
    constructor(type) {
        this._sequence = new Sequence();
        this.type = type;
        this.player = new Player().toDestination();
        this.chooseSample();
    }

    chooseSample() {
        const sample = choose(samples[[this.bank, choose(this.type)].join("_")]);
        const url = samples._base + sample;
        this.player.load(url);
    }

    set sequence(steps) {
        this._sequence.steps = steps.reduce((steps, cur) => {steps.push(cur, 0);return steps}, []);
    }

    step(time) {
        if(this._sequence.step()) this.player.start(time);
    }

}
