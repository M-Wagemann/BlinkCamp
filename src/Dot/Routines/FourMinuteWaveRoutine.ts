import { Dot } from "../Dot";
import { IDotRoutine } from "../IDotRoutine";
import { StopGameLoop } from "../../Engine/GameLoop.js";

const Amplitude = 25;
const waveMultiplier: number = 0.65;
const yMultiplier: number = 2;

let lastPhaseAngle: number = 0;
let totalTimePassed: number = 0;
let currentPolarity: 1 | -1 = 1;
let hasSwitchedDirection: boolean = false;

const TOTAL_DURATION: number = 240;
const HALF_DURATION: number = TOTAL_DURATION / 2;

const STANDARD_SCALE: number = 1;
const MIN_SCALE: number = 0.3;

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

export const FourMinuteWaveRoutine: IDotRoutine = {

    Execute: function (dot: Dot): void {
// Opacity beim ersten Frame zurücksetzen
        if (totalTimePassed === 0) {
            dot.htmlElement.style.opacity = "1";
            dot.htmlElement.style.transform = `translate(-50%, -50%) scale(${STANDARD_SCALE})`;
        }

        totalTimePassed += dot.dTime;

        if (!hasSwitchedDirection && totalTimePassed >= HALF_DURATION) {
            TriggerDisappear(dot);
            currentPolarity = -1;
            hasSwitchedDirection = true;
        }

        const timeInCurrentHalf = hasSwitchedDirection
            ? totalTimePassed - HALF_DURATION
            : totalTimePassed;

        const halfProgress: number = timeInCurrentHalf / HALF_DURATION;
        const speedMultiplier: number = 1 + (halfProgress * 1.5);

        const newPhaseAngle: number =
            currentPolarity * dot.dTime * dot.velocity * speedMultiplier + lastPhaseAngle;

        // Lemniscate (∞-Form)
        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle * waveMultiplier));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle * yMultiplier * waveMultiplier));

        lastPhaseAngle = newPhaseAngle;

        const currentScale = STANDARD_SCALE - (halfProgress * (STANDARD_SCALE - MIN_SCALE));
        dot.htmlElement.style.transform = `translate(-50%, -50%) scale(${currentScale})`;

        if (isInvisible) {
            invisibleTimer += dot.dTime;
            if (invisibleTimer >= DISAPPEAR_DURATION) {
                dot.htmlElement.style.opacity = "1";
                dot.htmlElement.style.transform = `translate(-50%, -50%) scale(${STANDARD_SCALE})`;
                isInvisible = false;
                invisibleTimer = 0;
            }
        }

        if (totalTimePassed >= TOTAL_DURATION - 1 && !isInvisible) {
            TriggerDisappear(dot);
        }

        if (totalTimePassed >= TOTAL_DURATION) {
            StopGameLoop();
            window.dispatchEvent(new CustomEvent('Game:BlockComplete'));
            ResetState();
        }
    },

    title: "4 Minute Progressive Shrinking Wave",
    duration: TOTAL_DURATION
};

function TriggerDisappear(dot: Dot): void {
    dot.htmlElement.style.opacity = "0";
    isInvisible = true;
    invisibleTimer = 0;
}