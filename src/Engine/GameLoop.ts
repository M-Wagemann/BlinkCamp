let lastFrameTime: number;
let tickEvent: CustomEvent;
let isRunning: boolean = false;

const loopDetail = {
    dTime: 0
};

export const StartGameLoop = (): void =>
{
    if (isRunning) return;

    isRunning = true;

    lastFrameTime = performance.now();
    tickEvent = new CustomEvent('GameLoop:Update', { detail: loopDetail });

    window.requestAnimationFrame(GameLoop);
}

export const StopGameLoop = (): void =>
{
    isRunning = false;
}

const GameLoop = (): void =>
{
    if (!isRunning) return;

    loopDetail.dTime = (performance.now() - lastFrameTime) / 1000;
    lastFrameTime = performance.now();

    window.dispatchEvent(tickEvent);

    window.requestAnimationFrame(GameLoop);
}
