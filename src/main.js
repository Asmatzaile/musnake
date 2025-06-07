import './style.css'
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

const actions = {
    STEER_UP: {
        key: 'ArrowUp',
        action: () => snake.up(),
    },
    STEER_RIGHT: {
        key: 'ArrowRight',
        action: () => snake.right(),
    },
    STEER_DOWN: {
        key: 'ArrowDown',
        action: () => snake.down(),
    },
    STEER_LEFT: {
        key: 'ArrowLeft',
        action: () => snake.left(),
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
