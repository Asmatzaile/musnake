import './style.css'
import * as Tone from "tone";
import { Grid } from './Grid';

const canvas = document.getElementById('app');
const ctx = canvas.getContext("2d");

const grid = new Grid(ctx);
const snake = grid.snake;

function tick() {
    grid.display();
    requestAnimationFrame(tick);
}
requestAnimationFrame(tick)

canvas.style.cursor = "pointer"
canvas.addEventListener("pointerdown", async() =>{
    canvas.style.cursor = "default"
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    const loop = new Tone.Loop(time => {
        if (Math.random()>0.5) synth.triggerAttackRelease("C4", 0.01, time)
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
