import * as Tone from "tone";

export class Sequencer {
    instruments = new Set();

    addInstrument(instrument) {
        this.instruments.add(instrument);
    }

    async start(onstep) {
        await Tone.start();
        new Tone.Loop(time => {
            this.instruments.forEach(instrument => instrument.step(time));
            onstep(time);
        }, 0.1).start(0);
        Tone.getTransport().start();
    }

}
