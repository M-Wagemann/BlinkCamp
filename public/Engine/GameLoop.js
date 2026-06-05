let lastFrameTime;
let tickEvent;
let isRunning = false;
const loopDetail = {
    dTime: 0
};
export const StartGameLoop = () => {
    if (isRunning)
        return;
    isRunning = true;
    lastFrameTime = performance.now();
    tickEvent = new CustomEvent('GameLoop:Update', { detail: loopDetail });
    window.requestAnimationFrame(GameLoop);
};
export const StopGameLoop = () => {
    isRunning = false;
};
const GameLoop = () => {
    if (!isRunning)
        return;
    loopDetail.dTime = (performance.now() - lastFrameTime) / 1000;
    lastFrameTime = performance.now();
    window.dispatchEvent(tickEvent);
    window.requestAnimationFrame(GameLoop);
};
