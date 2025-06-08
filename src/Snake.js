import * as Tone from "tone";
import { Cell } from "./Cell";
import { randInt } from "./utils";
class SnakeCell extends Cell {

    constructor({head, pos, midinote}) {
        super(pos);
        this.head = head ?? this;
        if (this.head === this) this.willPlay = true;
        this.midinote = midinote ?? randInt(60, 72);
        this.ampEnv = new Tone.AmplitudeEnvelope({attack: 0.001, decay: 0, sustain: 1, release: 0.05}).toDestination();
        new Tone.Oscillator(Tone.Midi(this.midinote).toFrequency(), "sine").connect(this.ampEnv).start();
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

    digest(newContents, grid) {
        const previous = this.previousCell;
        if (previous) previous.digest(this.stomachContents, grid);
        else if (this.stomachContents) this.grow(grid);
        this.stomachContents = newContents;
        if (this.stomachContents) {
            this.play(this.head.audiotime);
            this.stomachContents.play(this.head.audiotime);
        }
    }

    grow(grid) {
        const { midinote } = this.stomachContents;
        const previous = this.previousCell;
        const pos = previous ? previous.pos : grid.getCoordSum(this.pos, {x: this.direction.x*-1, y: this.direction.y*-1})
        const newCell = new SnakeCell({head: this.head, pos, midinote });
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
        ctx.fillStyle = "white"
        const scale = this.stomachContents ? 1.2 : 1;
        super.display(ctx, w, h, scale)
    }

    play(time) {
        this.ampEnv.triggerAttackRelease(0.05, time);
    }
}

export class Snake {
    _direction = {x: 0, y: -1};
    directionQueue = [];
    stepN = -1;

    set direction({x=0, y=0}) {
        const lastDirection = this.directionQueue[this.directionQueue.length-1] ?? this._direction;
        const xChange = Math.abs(x-lastDirection.x);
        const yChange = Math.abs(y-lastDirection.y);
        const isValid = xChange+yChange !== 0 && ((xChange < 2 && yChange < 2) || this.length === 1)
        if (isValid) this.directionQueue.push({x,  y});
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

    step(audiotime) {
        this.stepN++;
        this.head.audiotime = audiotime;
        this.move();
        const item = this.grid.getItemAtPos(this.head.pos);
        this.eat(item);
        if (this.stepN % 2 === 0) this.head.sequenceStep();
    }

    eat(item) {
        if (!item) return this.head.digest(item, this.grid);
        const { midinote } = item;
        this.head.digest(new SnakeCell({midinote}), this.grid);
        if (item) item.beEaten();
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
