import { StopGameLoop } from "../../Engine/GameLoop.js";
const Amplitude = 25;
let lastPhaseAngle = 0;
let totalTimePassed = 0;
let currentPolarity = 1;
let hasSwitchedDirection = false;
const TOTAL_DURATION = 240;
const HALF_DURATION = TOTAL_DURATION / 2;
// Größensteuerung
const STANDARD_SCALE = 1;
const MIN_SCALE = 0.3;
// Unsichtbar-Zeit (Sekunden)
const DISAPPEAR_DURATION = 0.6;
let invisibleTimer = 0;
let isInvisible = false;
const ResetState = () => {
    lastPhaseAngle = 0;
    totalTimePassed = 0;
    currentPolarity = 1;
    hasSwitchedDirection = false;
    invisibleTimer = 0;
    isInvisible = false;
};
export const FourMinuteHalfDirectionChangeRoutine = {
    Execute: function (dot) {
        totalTimePassed += dot.dTime;
        // Richtungswechsel exakt bei 120s
        if (!hasSwitchedDirection && totalTimePassed >= HALF_DURATION) {
            TriggerDisappear(dot);
            currentPolarity = -1;
            hasSwitchedDirection = true;
        }
        // Fortschritt innerhalb der aktuellen Hälfte
        const timeInCurrentHalf = hasSwitchedDirection
            ? totalTimePassed - HALF_DURATION
            : totalTimePassed;
        const halfProgress = timeInCurrentHalf / HALF_DURATION;
        // Geschwindigkeit steigt
        const speedMultiplier = 1 + (halfProgress * 1.5);
        const newPhaseAngle = currentPolarity *
            dot.dTime *
            dot.velocity *
            speedMultiplier +
            lastPhaseAngle;
        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));
        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);
        // Ball wird kleiner pro Halbzeit
        const currentScale = STANDARD_SCALE - (halfProgress * (STANDARD_SCALE - MIN_SCALE));
        dot.htmlElement.style.transform =
            `translate(-50%, -50%) scale(${currentScale})`;
        // Unsichtbarkeitslogik
        if (isInvisible) {
            invisibleTimer += dot.dTime;
            if (invisibleTimer >= DISAPPEAR_DURATION) {
                dot.htmlElement.style.opacity = "1";
                dot.htmlElement.style.transform =
                    `translate(-50%, -50%) scale(${STANDARD_SCALE})`;
                isInvisible = false;
                invisibleTimer = 0;
            }
        }
        // Kurz vor Ende nochmal verschwinden
        if (totalTimePassed >= TOTAL_DURATION - 1 && !isInvisible) {
            TriggerDisappear(dot);
        }
        // Nach 4 Minuten stoppen
        if (totalTimePassed >= TOTAL_DURATION) {
            StopGameLoop();
            const startScreen = document.getElementById("startscreen");
            if (startScreen) {
                startScreen.style.display = "flex";
            }
            ResetState();
        }
    },
    title: "4 Minute Progressive Shrinking Rotation",
    duration: TOTAL_DURATION
};
// Helper
function TriggerDisappear(dot) {
    dot.htmlElement.style.opacity = "0";
    isInvisible = true;
    invisibleTimer = 0;
}
