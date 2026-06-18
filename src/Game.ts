import { StartGameLoop } from "./Engine/GameLoop.js";
import { Dot } from "./Dot/Dot.js";
import RoutineManager from "./Dot/DotRoutineManager.js";

const blocks = [0, 1, 2, 3];
const blockNames = ["Block 1: Kreis", "Block 2: Unendlich", "Block 3: Kreis variabel", "Block 4: Unendlich variabel"];
const pauseAfterBlock = [90, 90, 90, 180];

let nextBlockIndex = 0;
let countdownInterval: number | null = null;

const msg = document.getElementById("startscreen-message") as HTMLElement;
const countdownEl = document.getElementById("countdown") as HTMLElement;
const startScreen = document.getElementById("startscreen") as HTMLElement;

const showPauseScreen = (message: string, seconds: number) => {
    startScreen.style.display = "flex";
    msg.textContent = message;
    countdownEl.style.display = "block";

    let remaining = seconds;
    countdownEl.textContent = String(remaining);
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = window.setInterval(() => {
        remaining--;
        countdownEl.textContent = String(Math.max(0, remaining));
        if (remaining <= 0) { clearInterval(countdownInterval!); countdownInterval = null; }
    }, 1000);
};

window.addEventListener('Game:BlockComplete', () => {
    const justFinished = nextBlockIndex - 1;
    const pause = pauseAfterBlock[justFinished];

    if (nextBlockIndex >= blocks.length) {
        showPauseScreen("Alle Übungen abgeschlossen. Danke!", pause);
    } else {
        showPauseScreen(`${blockNames[justFinished]} abgeschlossen. Drücke SPACE für ${blockNames[nextBlockIndex]}.`, pause);
    }
});

window.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    if (nextBlockIndex >= blocks.length) return;
    if (startScreen.style.display === "none") return;

    event.preventDefault();
    startScreen.style.display = "none";
    countdownEl.style.display = "none";

    RoutineManager.currentRoutineIndex = blocks[nextBlockIndex];
    nextBlockIndex++;
    StartGameLoop();
});

new Dot(document.getElementById("dot") as HTMLElement);