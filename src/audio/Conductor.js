import * as Tone from 'tone';
import { Sequencer } from './Sequencer';
import { Pads } from './Pads';
import { BassSynth } from './BassSynth';
import { choose, euclid, randInt } from "../utils";

export class Conductor {
    inNirvana = false;
    constructor() {
        document.addEventListener('snakeDied', () => {
            this.reset();
        });
        this.sequencer = new Sequencer();
        
        document.addEventListener('foodEaten', () => {
            this.randomizePadsBass();
            if (this.inNirvana) this.bassSynth.trigger();
        });
        
        document.addEventListener('modeNirvana', () => {
            this.inNirvana = true;
            this.pads.unmute();
            this.sequencer.mute();
        });

        document.addEventListener('modeNormal', () => {
            this.inNirvana = false;
            this.pads.mute();
            this.sequencer.unmute();
        })
        
    }
    
    async start(onstep) {
        await Tone.start();
        this.sequencer.start(onstep);
        Tone.getTransport().start();
        this.pads = new Pads();
        this.bassSynth = new BassSynth();
        this.randomizePadsBass();
    }
    
    reset() {
        this.sequencer.randomize();
        this.pads.mute();
    }

    randomizePadsBass() {
        const newPitches = this.getNewPitches();
        this.pads.setPitches(newPitches.map(pitch => pitch+72));
        this.bassSynth.freq = Tone.Midi(choose(newPitches)+36);
    }

    // for pads and bass
    getNewPitches() {
        return euclid(5, 12, randInt(5)).reduce((arr, val, i) => {
            if (val !== 0) arr.push(i);
            return arr;
        }, []);
    }
    

}