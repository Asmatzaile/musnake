import './style.css'
import * as Tone from "tone";
import { Grid } from './Grid';
import { Drum } from './Drum';
import { getACoprime, euclid, choose } from './utils';

const canvas = document.getElementById('app');
const ctx = canvas.getContext("2d");

const grid = new Grid(ctx);
const snake = grid.snake;


function tick() {
    grid.display();
    requestAnimationFrame(tick);
}
requestAnimationFrame(tick)

// 6 is not a good number as it is not coprime with any number
// greater than 1 and smaller than itself-1 (i.e. 2, 3 or 4)
const seq1Len = choose([5, 7, 8, 9, 10, 11]);
const seq2Len = getACoprime(seq1Len, 5, 12, {skip: 6});
const seq1 = euclid(getACoprime(seq1Len, Math.min(seq1Len - 3, 3), seq1Len-1), seq1Len);
const seq2 = euclid(getACoprime(seq2Len, Math.min(seq2Len - 3, 3), seq2Len-1), seq2Len);

const drum1 = new Drum(Drum.type.BASS);
drum1.sequence = seq1
const drum2 = new Drum(Drum.type.MID);
drum2.sequence = seq2;

canvas.style.cursor = "pointer";
canvas.addEventListener("pointerdown", async() =>{
    canvas.style.cursor = "default"
    await Tone.start();
    const loop = new Tone.Loop(time => {
        drum1.step(time);
        drum2.step(time);
        grid.update();
    }, 0.1);
    loop.start(0);
    Tone.getTransport().start();
}, {once: true})

const actions = {
    STEER_UP: {
        key: 'ArrowUp',
        action: () => snake.direction = {y: -1},
    },
    STEER_RIGHT: {
        key: 'ArrowRight',
        action: () => snake.direction = {x: 1},
    },
    STEER_DOWN: {
        key: 'ArrowDown',
        action: () => snake.direction = {y: 1},
    },
    STEER_LEFT: {
        key: 'ArrowLeft',
        action: () => snake.direction = {x: -1},
    },
}

document.addEventListener('keydown', (e) => {
    [...Object.entries(actions)].forEach(([_name, info]) => {
        if (info.key === e.key) {
            e.preventDefault();
            info.action();
        }
    })
});
