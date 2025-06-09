import * as Tone from "tone";
import { Drum } from "./Drum";
import { choose, getACoprime, euclid } from "../utils";

export class Sequencer {
    muted = false;
    instruments = new Set();

    constructor() {
        this.drum1 = new Drum(Drum.type.BASS);
        this.drum2 = new Drum(Drum.type.MID);
        this.makeRandomSequences();
        this.instruments.add(this.drum1);
        this.instruments.add(this.drum2);
    }

    addInstrument(instrument) {
        this.instruments.add(instrument);
    }

    async start(onstep) {
        await Tone.start();
        new Tone.Loop(time => {
            if (!this.muted) this.instruments.forEach(instrument => instrument.step(time));
            onstep(time);
        }, 0.1).start(0);
        Tone.getTransport().start();
    }

    
    // 6 is not a good number as it is not coprime with any number
    // greater than 1 and smaller than itself-1 (i.e. 2, 3 or 4)
    getNewDrumSequences() {
        const seq1Len = choose([5, 7, 8, 9, 10, 11]);
        const seq2Len = getACoprime(seq1Len, 5, 12, {skip: 6});
        const seq1 = euclid(getACoprime(seq1Len, Math.min(seq1Len - 3, 3), seq1Len-1), seq1Len);
        const seq2 = euclid(getACoprime(seq2Len, Math.min(seq2Len - 3, 3), seq2Len-1), seq2Len);
        return [seq1, seq2];
    }

    makeRandomSequences() {
        const [seq1, seq2] = this.getNewDrumSequences();
        this.drum1.sequence = seq1;
        this.drum2.sequence = seq2;
    }

    randomize() {
        this.makeRandomSequences();
        this.drum1.chooseSample();
        this.drum2.chooseSample();
    }

    mute() {
        this.muted = true;
    }
    unmute() {
        this.muted = false;
    }

}
