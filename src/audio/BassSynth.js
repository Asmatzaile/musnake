import * as Tone from "tone"
export class BassSynth {
    _freq;

    get freq() {
        return this._freq;
    }

    set freq(freq) {
        this._freq = freq;
        [...Object.values(this.oscillators)].forEach(osc => osc.setFreq(freq));
    }

    oscillators = {
        1: {
            env: [100, 5, 0, 200],
            freq: f => f*3-1,
        },
        2: {
            env: [100, 5, 0, 500],
            modulator: 1,
            freq: f => f*2 + 3,
        },
        3: {
            env: [1, 5, 0, 1500],
            modulator: 2,
            freq: f => f,
            output: true,
        },
        4: {
            env: [1200, 5, 0, 30],
            freq: f => f*7-2,
        },
        5: {
            env: [100, 5, 0, 350],
            modulator: 4,
            freq: f => f*4-3,
        },
        6: {
            env: [0.3, 5, 0, 700],
            modulator: 5,
            freq: f => f*2+1,
            output: true,
        },
    }
    constructor(initialFreq=440) {
        this._freq = Tone.Frequency(initialFreq);
        this.output = new Tone.Distortion(0.1).toDestination();
        [...Object.entries(this.oscillators)].forEach(([id, props]) => {
            const envelope = new Tone.Gain(0);

            envelope.trigger = (time=Tone.now()) => {
                time = Tone.Time(time).toSeconds();
                for (let i = 0; i < props.env.length; i+=2) {
                    const gain = props.env[i];
                    const rampTime = props.env[i+1] / 1000;
                    envelope.gain.linearRampTo(gain,rampTime, time);
                    time += rampTime;
                }
            }
            
            const add = new Tone.Add();
            const baseFreq = new Tone.Signal(props.freq(initialFreq));
            baseFreq.connect(add);
            if (props.modulator) this.oscillators[props.modulator].envelope.connect(add.addend);
            const osc = new Tone.Oscillator(0, "sine");
            osc.start();
            osc.connect(envelope);
            add.connect(osc.frequency);
            if (props.output) envelope.connect(this.output);
            
            this.oscillators[id].envelope = envelope;
            this.oscillators[id].oscillator = osc;
            this.oscillators[id].setFreq = freq => baseFreq.value = props.freq(freq);
        });
    }

    trigger(time) {
        [...Object.values(this.oscillators)].forEach(({envelope})=>envelope.trigger(time));
    }

    dispose() {
        [...Object.values(this.oscillators)].forEach(osc => {
            osc.oscillator.dispose();
            osc.envelope.dispose();
        })
    }


}