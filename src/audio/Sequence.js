export class Sequence {
    steps = [];
    currentIndex = -1;

    constructor(steps=[]) {
        this.steps = steps;
    }

    step() {
        if (this.steps.length === 0) return this.currentIndex = undefined;
        this.currentIndex = (this.currentIndex+1) % this.steps.length;
        return this.currentStep;
    }

    get currentStep() {
        if (this.currentIndex === undefined) return;
        return this.steps[this.currentIndex];
    }
}
