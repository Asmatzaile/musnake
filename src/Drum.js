
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
        const sample = choose(samples[[this.bank, choose(type)].join("_")]);
        const url = samples._base + sample;
        this.player = new Player(url).toDestination();
    }

    set sequence(steps) {
        this._sequence.steps = steps.reduce((steps, cur) => {steps.push(cur, 0);return steps}, []);
    }

    step(time) {
        if(this._sequence.step()) this.player.start(time);
    }

}