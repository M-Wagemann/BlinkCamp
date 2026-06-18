import { Dot } from "../Dot";
import { IDotRoutine } from "../IDotRoutine";
import { StopGameLoop } from "../../Engine/GameLoop.js";

const Amplitude = 25;

let lastPhaseAngle: number = 0;
let totalTimePassed: number = 0;
let currentPolarity: 1 | -1 = 1;
let hasSwitchedDirection: boolean = false;

const TOTAL_DURATION: number = 120;
const HALF_DURATION: number = TOTAL_DURATION / 2;

// Größensteuerung
const STANDARD_SCALE: number = 1;
const MIN_SCALE: number = 0.3;

// Unsichtbar-Zeit (Sekunden)
const DISAPPEAR_DURATION: number = 0.6;

let invisibleTimer: number = 0;
let isInvisible: boolean = false;

const ResetState = (): void => {
    lastPhaseAngle = 0;
    totalTimePassed = 0;
    currentPolarity = 1;
    hasSwitchedDirection = false;
    invisibleTimer = 0;
    isInvisible = false;
};

export const TwoMinuteCircleRoutine: IDotRoutine = {

    Execute: function (dot: Dot): void {

        totalTimePassed += dot.dTime;

        // Richtungswechsel exakt bei 120s
        if (!hasSwitchedDirection && totalTimePassed >= HALF_DURATION) {
            TriggerDisappear(dot);
            currentPolarity = -1;
            hasSwitchedDirection = true;
        }

        // Fortschritt innerhalb der aktuellen Hälfte
        const timeInCurrentHalf =
            hasSwitchedDirection
                ? totalTimePassed - HALF_DURATION
                : totalTimePassed;

        const halfProgress: number = timeInCurrentHalf / HALF_DURATION;

        // Geschwindigkeit steigt
        const speedMultiplier: number = 1 + (halfProgress * 1.5);

        const newPhaseAngle: number =
            currentPolarity *
            dot.dTime *
            dot.velocity *
            speedMultiplier +
            lastPhaseAngle;

        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));

        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);

        // Ball wird kleiner pro Halbzeit
        const currentScale =
            STANDARD_SCALE - (halfProgress * (STANDARD_SCALE - MIN_SCALE));

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
            window.dispatchEvent(new CustomEvent('Game:BlockComplete'));
            ResetState();
        }
    },

    title: "4 Minute Progressive Shrinking Rotation",

    duration: TOTAL_DURATION
};

// Helper
function TriggerDisappear(dot: Dot): void {
    dot.htmlElement.style.opacity = "0";
    isInvisible = true;
    invisibleTimer = 0;
}
