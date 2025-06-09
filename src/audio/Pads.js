import { SuperOscillator } from "./SuperOscillator";
import * as Tone from "tone";

export class Pads {
    constructor() {
        this.pads = this.createPads();
    }


    createPads() {
        this.gainNode = new Tone.Gain(0).toDestination();
        const gain = new Tone.Gain(0.4).connect(this.gainNode);
        const f2 = new Tone.OnePoleFilter(2000, "lowpass").connect(gain);
        const f1 = new Tone.OnePoleFilter(2000, "lowpass").connect(f2);
        return Array(5).fill(0).map(() => this.createPad(f1));
    }

    createPad(destination) {
        const pad = new SuperOscillator(440, "sawtooth", 40).connect(destination);
        pad.start();
        return pad;
    }
    
    setPitches(pitchesArray) {
        this.pads.forEach((pad, index) => {
            pad.frequency.value = Tone.Midi(pitchesArray[index]);
            pad.spread = pad.spread; // just make them change the spread for a subtle timbric change
        })
    }
    
    mute(time) {
        this.gainNode.gain.setValueAtTime(0, time);
    }

    unmute(time) {
        this.gainNode.gain.setValueAtTime(1, time);
    }
    

}
