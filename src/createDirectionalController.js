import { poltocar } from "./utils";

function setAbortableInterval(callback, interval, {signal}) {
  const id = setInterval(() => {
    if (signal.aborted) return clearInterval(id);
    callback();
  }, interval);

  signal.addEventListener('abort', () => clearInterval(id));

  return id;
}

function setAbortableTimeout(callback, ms, {signal}) {
  const id = setTimeout(() => {
    if (signal.aborted) return clearTimeout(id);
    callback();
  }, ms);

  signal.addEventListener('abort', () => clearTimeout(id));

  return id;
}

function clickButton(button) {
    const controller = new AbortController();
    const signal = controller.signal;
    button.classList.add("clicked")
    button.click();
    signal.addEventListener("abort", () => button.classList.remove("clicked"))
    setAbortableTimeout(() => setAbortableInterval(() => button.click(), 30, { signal }), 500, { signal });
    button.addEventListener("pointerup", () => controller.abort(), { signal });
    button.addEventListener("pointerleave", () => controller.abort(), { signal });
    return controller;
}

export function createDirectionalController(actions) {
    const area = document.getElementById('directional-buttons');
    const directionalButtons = {};
    [... area.children].forEach(button => {
        if (button.id === "circle") return;
        button.addEventListener("click", (e) => {
            if (e.isTrusted) return; // only allow false clicks
            actions[button.dataset.action].action();
        });
        button.addEventListener("pointerdown", () => clickButton(button));
        directionalButtons[button.dataset.startTurn] = {action: actions[button.dataset.action], button};
    })
    addCircleControls(area, area.querySelector('#circle'), directionalButtons)
}

let circleOffset;
let centerPoint;
let maxR2;
let circleH;
let lastBtn = undefined;
let abortController;
function addCircleControls(area, circle, directionalButtons) {
   document.addEventListener("pointerdown", e => {
        const isCoarse = matchMedia('(pointer:coarse)').matches
        if (e.target !== circle && !(isCoarse && e.target===area)) return;
        const {x: areaX, y: areaY, width: areaW, height: areaH} = area.getBoundingClientRect();
        circleH = circle.getBoundingClientRect().height;
        centerPoint = {x: areaX + areaW/2, y: areaY + areaH / 2};
        maxR2 = Math.pow((areaH - circleH)/2, 2);
        const {clientX: x, clientY: y} = e;
        circleOffset = {x: x - centerPoint.x - circleH/2, y: y - centerPoint.y - circleH/2};
    })
    document.addEventListener("pointermove", e => {
        if (circleOffset === undefined) return;
        const {x: x0, y: y0} = centerPoint;
        const {clientX: x1, clientY: y1} = e;
        const tX = x1 - x0;
        const tY = y1 - y0;
        const r2 = Math.min(tX * tX + tY * tY, maxR2);
        const r = Math.sqrt(r2);
        const theta = Math.atan2(tY, tX);
        const [x, y] = poltocar(r, theta);
        circle.style.translate = `${x}px ${y}px`;

        const deadRadius = 12;
        let nextBtn;
        if (r <= deadRadius) nextBtn = undefined;
        else {
            const turn = ((theta / Math.PI + 2.25) % 2) / 2;
            const stepTurn = Math.floor(turn*4)/4;
            nextBtn = directionalButtons[stepTurn];
        }
        if (lastBtn === nextBtn) return;
        if (lastBtn !== undefined) abortController.abort();
        lastBtn = nextBtn;
        if (nextBtn === undefined) return;
        abortController = clickButton(nextBtn.button)

    })
    document.addEventListener("pointerup", () => {
        abortController?.abort();
        circleOffset = undefined;
        circle.style.translate = "";
    });
}
