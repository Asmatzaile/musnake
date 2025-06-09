import * as Tone from "tone";
import { Cell } from "./Cell";
import { lerp, randInt } from "./utils";
class SnakeCell extends Cell {

    constructor({head, pos, midinote}) {
        super(pos);
        this.head = head ?? this;
        if (this.head === this) this.willPlay = true;
        this.midinote = midinote ?? randInt(60, 72);
        this.synth = new Tone.Synth({oscillator: {type: "sine"}, envelope: {attack: 0.001, decay: 0, sustain: 1, release: 0.05}}).toDestination();
    }

    moveAbs(newPos, grid) {
        if (this.previousCell) this.previousCell.moveAbs(this.pos, grid);
        this.direction = grid.moduloCoords({x: newPos.x - this.pos.x, y: newPos.y - this.pos.y});
        this.pos = newPos;
    }
    moveRel(grid, rel) {
        const newPos = grid.getCoordSum(this.pos, rel);
        this.moveAbs(newPos, grid);
    }

    eat(content) {
        if (this !== this.head) console.error("Trying to eat while not head!");
        this.stomachContents = content;
        this.playStomachContents();
    }

    digest(newContents, grid) {
        const previous = this.previousCell;
        if (previous) previous.digest(this.stomachContents, grid);
        else if (this.stomachContents) this.grow(grid);
        this.stomachContents = newContents;
        this.playStomachContents();
    }
    
    playStomachContents() {
        if (!this.stomachContents) return;
        this.play(this.head.audiotime);
        this.stomachContents.play(this.head.audiotime);
    }

    grow(grid) {
        const previous = this.previousCell;
        const newCell = this.stomachContents;
        newCell.head = this.head;
        newCell.pos = previous ? previous.pos : grid.getCoordSum(this.pos, {x: this.direction.x*-1, y: this.direction.y*-1});
        newCell.willPlay = false;
        this.previousCell = newCell;
        newCell.play(this.head.audiotime);
    }

    sequenceStep() {
        const willPlay = this.willPlay;
        const previous = this.previousCell;
        if (previous) previous.sequenceStep();
        if (willPlay && this.stomachContents === undefined) this.play(this.head.audiotime);
        (previous ?? this.head).willPlay = willPlay;
    }

    display(ctx, w, h) {
        const y = Math.pow(this.synth.envelope.value, 0.1);
        const color = lerp(y, 0.5, 1) * 255;
        ctx.fillStyle = `rgb(${color} ${color} ${color})`
        const scale = this.stomachContents ? 1.2 : 1;
        super.display(ctx, w, h, scale)
    }

    play(time) {
        this.synth.triggerAttackRelease(Tone.Midi(this.midinote), 0.05, time);
    }

    destroy() {
        if (this.previousCell) this.previousCell.destroy();
        this.synth.dispose();
    }

    stopPlaying() {
        if (this.previousCell) this.previousCell.stopPlaying();
        this.willPlay = false;
    }
}

export class Snake {
    _direction = {x: 0, y: -1};
    directionQueue = [];
    nirvana = false;

    set direction({x=0, y=0}) {
        const lastDirection = this.directionQueue[this.directionQueue.length-1] ?? this._direction;
        const xChange = Math.abs(x-lastDirection.x);
        const yChange = Math.abs(y-lastDirection.y);
        const isValid = ((xChange < 2 && yChange < 2) || this.length === 1)
        if (!isValid) return;
        if (this.nirvana) {
            this._direction = {x, y};
            this.step();
            return;
        }
        if (xChange+yChange !== 0) this.directionQueue.push({x,  y});
    }

    constructor(x, y, grid) {
        this.grid = grid;
        this.head = new SnakeCell({pos: {x,y}});
    }

    get cells() {
        const cells = [this.head];
        let current = this.head;
        while(current.previousCell) {
            current = current.previousCell;
            cells.push(current);
        };
        return cells;
    }

    get length() {
        return this.cells.length;
    }

    sequenceStep(audiotime) {
        this.head.audiotime = audiotime;
        this.head.digest(undefined, this.grid);
        if (!this.nirvana) this.step();
    }

    step() {
        this.move();
        const item = this.grid.getItemAtPos(this.head.pos);
        this.eat(item);
    }

    eat(item) {
        if (!item) return;
        if (item instanceof SnakeCell) return this.die();
        const { midinote } = item;
        this.head.eat(new SnakeCell({midinote}), this.grid);
        if (item) item.beEaten(this);
    }

    die() {
        document.dispatchEvent(new Event('snakeDied'));
        this.head.destroy();
    }

    toggleNirvana() {
        this.nirvana = !this.nirvana;
        this.grid.invert(this.nirvana);
        if (this.nirvana) this.head.stopPlaying();
        else this.head.willPlay = true;
        if (this.nirvana) document.dispatchEvent(new Event("modeNirvana"));
        else document.dispatchEvent(new Event("modeNormal"));
        
    }

    move() {
        this._direction = this.directionQueue.shift() ?? this._direction;
        this.head.moveRel(this.grid, this._direction);
    }

    display(ctx) {
        const cellW = this.grid.cellW;
        const cellH = this.grid.cellH;
        this.cells.forEach(cell => cell.display(ctx, cellW, cellH));
    }
}
