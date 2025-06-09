import './style.css'
import { Grid } from './Grid';
import { Conductor } from './audio/Conductor';
import { createDirectionalController } from './createDirectionalController';

const canvas = document.getElementById('app');
const ctx = canvas.getContext("2d");

const grid = new Grid(ctx);
let snake = grid.snake;


function draw() {
    grid.display();
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function tick(audiotime) {
    grid.update(audiotime);
}

document.addEventListener('snakeDied', () =>{
    setTimeout(()=>snake = grid.snake, 10)
});


const conductor = new Conductor();
const startBtn = document.querySelector('#start-btn');
startBtn.addEventListener("click", ()=> {
    conductor.start(time => tick(time));
    startBtn.remove();
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

createDirectionalController(actions);
document.addEventListener('keydown', (e) => {
    [...Object.entries(actions)].forEach(([_name, info]) => {
        if (info.key === e.key) {
            e.preventDefault();
            info.action();
        }
    })
});