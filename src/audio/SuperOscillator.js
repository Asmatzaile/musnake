// based on FatOscillator from Tone.js, which is licensed under MIT
// MIT License

// Copyright (c) 2014-2020 Yotam Mann

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { Source } from "tone/build/esm/source/Source";
import { Signal, optionsFromArguments, FatOscillator, Oscillator } from "tone";

export class SuperOscillator extends Source {
    oscillators = []
    _phase = 0;
    _spread = 0;

    // frequency, type, spread
    constructor(frequency, type, spread) {
        const options = optionsFromArguments(
            FatOscillator.getDefaults(),
            [frequency, type, spread],
            ["frequency", "type", "spread"]
        );
        super(options);
        this._type = options.type;
        this._spread = options.spread;
        this._phase = options.phase;
        this.frequency = new Signal({
            context: this.context,
            units: "frequency",
            value: options.frequency,
        });
        this.detune = new Signal({
            context: this.context,
			units: "cents",
			value: options.detune,
        })
        this.count = options.count;
    }

    start(time) {
        this.oscillators.forEach(osc => osc.start(time));
    }
    stop(time) {
        this.oscillators.forEach(osc => osc.stop(time));
    }
    restart(time) {
        this.oscillators.forEach(osc => osc.restart(time))
    }

    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
        this.oscillators.forEach(osc => osc.type = type);
    }

    get spread() {
        return this._spread;
    }
    set spread(spread) {
        this._spread = spread;
        if (this.oscillators.length <= 1) return;
        this.oscillators.slice(1).forEach(osc => osc.detune.value = (Math.random() - 0.5) * spread);
    }

    get count() {
		return this.oscillators.length;
	}
	set count(count) {
		if (this.oscillators.length === count) return;
        // dispose the previous oscillators
        this.oscillators.forEach(osc => osc.dispose());
        this.oscillators = [];
        for (let i = 0; i < count; i++) {
            const osc = new Oscillator({
                context: this.context,
                volume: -6 - count * 1.1,
                type: this._type,
                phase: this._phase + (i / count) * 360,
            });
            if (this.type === "custom") {
                osc.partials = this._partials;
            }
            this.frequency.connect(osc.frequency);
            this.detune.connect(osc.detune);
            osc.detune.overridden = false;
            osc.connect(this.output);
            this.oscillators[i] = osc;
        }
        // set the spread
        this.spread = this._spread;
        if (this.state === "started") {
            this.oscillators.forEach(osc => osc.start());
        }
	}

    get phase() {
		return this._phase;
	}
	set phase(phase) {
		this._phase = phase;
		this.oscillators.forEach(
			(osc, i) => (osc.phase = this._phase + (i / this.count) * 360)
		);
	}
}
