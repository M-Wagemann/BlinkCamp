import { Dot } from "./Dot/Dot.js";
import { SubscribeToRoutineChangedEvent } from "./RoutineTitleFollower.js";
import { SubscribeToNotificationsButtonClick } from "./PushNotifications.js";
import { StartGameLoop } from "./Engine/GameLoop.js";
import RoutineManager from "./Dot/DotRoutineManager.js";
const blockRoutineIndices = [0, 1, 2];
const blockLabels = [
    "Press SPACE to start",
    "Block 1 complete. Press SPACE for Block 2",
    "Block 2 complete. Press SPACE for Block 3"
];
console.log("GAME LOADED");
const InitializeScene = () => {
    new Dot(document.getElementById("dot"));
    // TODO
    // Creat UIEventDispatcher class (component base type) and move them there, and change the name of this class to GameScene.
    SetLeftArrowEvent();
    SetRightArrowEvent();
    SetVelocityChangeEvent();
    SetRadiusChangeEvent();
    // SetReminderButtonEvent();
    // TODO
    // Create a component base class which has awake and update methods, and instantiate those classes instead.
    SubscribeToRoutineChangedEvent();
    SubscribeToNotificationsButtonClick();
};
const SetLeftArrowEvent = () => {
    const leftArrowClickEvent = new CustomEvent('Game:LeftArrowClick');
    const leftArrow = document.querySelector(".arrow.left");
    leftArrow.addEventListener("click", () => {
        window.dispatchEvent(leftArrowClickEvent);
    });
};
const SetRightArrowEvent = () => {
    const rightArrowClickEvent = new CustomEvent('Game:RightArrowClick');
    const rightArrow = document.querySelector(".arrow.right");
    rightArrow.addEventListener("click", () => {
        window.dispatchEvent(rightArrowClickEvent);
    });
};
const SetVelocityChangeEvent = () => {
    const velocitySlider = document.getElementById("velocityslider");
    const velocityValueChanged = new CustomEvent('Game:VelocityValueChanged', {
        detail: {
            velocity: velocitySlider.value
        }
    });
    velocitySlider.addEventListener("input", () => {
        velocityValueChanged.detail.velocity = velocitySlider.value;
        window.dispatchEvent(velocityValueChanged);
    });
};
const SetRadiusChangeEvent = () => {
    const radiusSlider = document.getElementById("sizeslider");
    const radiusValueChanged = new CustomEvent('Game:RadiusValueChanged', {
        detail: {
            radius: radiusSlider.value
        }
    });
    radiusSlider.addEventListener("input", () => {
        radiusValueChanged.detail.radius = radiusSlider.value;
        window.dispatchEvent(radiusValueChanged);
    });
};

const showStartScreen = (message) => {
    const startScreen = document.getElementById("startscreen");
    const p = startScreen === null || startScreen === void 0 ? void 0 : startScreen.querySelector("p");
    if (startScreen)
        startScreen.style.display = "flex";
    if (p)
        p.textContent = message;
};
let currentBlock = 0;
window.addEventListener('Game:BlockComplete', () => {
    currentBlock++;
    if (currentBlock < blockRoutineIndices.length) {
        showStartScreen(blockLabels[currentBlock]);
    }
    else {
        showStartScreen("All done! Thanks for participating.");
    }
});
window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && currentBlock < blockRoutineIndices.length) {
        event.preventDefault();
        const startScreen = document.getElementById("startscreen");
        if (startScreen)
            startScreen.style.display = "none";
        RoutineManager.currentRoutineIndex = blockRoutineIndices[currentBlock];
        StartGameLoop();
    }
});
InitializeScene();
