import { Dot } from "./Dot/Dot.js";

let lastFrameTime;
let dTime;
let gameStarted = false;

const Initialize = () => {

    console.log("App initialized");

    new Dot(document.getElementById("dot"));

    // ✅ Keydown Listener
    window.addEventListener("keydown", (event) => {

        console.log("Key pressed:", event.code);

        // Robuster Check (funktioniert in allen Browsern)
        if ((event.code === "Space" || event.key === " ") && !gameStarted) {
            event.preventDefault();
            StartGame();
        }
    });
};

const StartGame = () => {

    console.log("Game started");

    gameStarted = true;

    const startScreen = document.getElementById("startscreen");
    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    lastFrameTime = performance.now();
    window.requestAnimationFrame(GameLoop);
};

const GameLoop = () => {

    dTime = (performance.now() - lastFrameTime) / 1000;
    lastFrameTime = performance.now();

    window.dispatchEvent(
        new CustomEvent("App:Update", { detail: dTime })
    );

    window.requestAnimationFrame(GameLoop);
};

Initialize();

