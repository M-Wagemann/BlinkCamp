import { Dot } from "../Dot";
import { IDotRoutine } from "../IDotRoutine";
import { StopGameLoop } from "../../Engine/GameLoop.js";

const Amplitude = 25;

let lastPhaseAngle: number = 0;
let totalTimePassed: number = 0;

const TOTAL_DURATION: number = 120;

const STANDARD_SCALE: number = 1;
const MIN_SCALE: number = 0.3;

const DISAPPEAR_DURATION: number = 0.6;
let invisibleTimer: number = 0;
let isInvisible: boolean = false;

// Richtungswechsel-Logik
type DirectionChangePolarity = 1 | -1;
let currentPolarity: DirectionChangePolarity = 1;
let currentDirectionChangeTime: number = 0;
let timePassedSinceLastDirectionChange: number = 0;
let bHasActiveDirectionChangeTimer: boolean = false;
const minTimePerDirectionChange: number = 0.3;
const maxTimePerDirectionChange: number = 2;

// Seed-basierter Zufallsgenerator (Mulberry32)
const SEED = 42; // <-- hier den Seed ändern
let seedState = SEED;

const seededRandom = (): number => {
    seedState |= 0;
    seedState = seedState + 0x6D2B79F5 | 0;
    let t = Math.imul(seedState ^ seedState >>> 15, 1 | seedState);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const seededGetRandomInBetween = (min: number, max: number): number => {
    return min + seededRandom() * (max - min);
};

const ResetState = (): void => {
    lastPhaseAngle = 0;
    totalTimePassed = 0;
    invisibleTimer = 0;
    isInvisible = false;
    currentPolarity = 1;
    currentDirectionChangeTime = 0;
    timePassedSinceLastDirectionChange = 0;
    bHasActiveDirectionChangeTimer = false;
    seedState = SEED;
};


export const TwoMinuteDirectionChangingCircleRoutine: IDotRoutine = {

    Execute: function (dot: Dot): void {

        // Opacity beim ersten Frame zurücksetzen
        if (totalTimePassed === 0) {
            dot.htmlElement.style.opacity = "1";
            dot.htmlElement.style.transform = `translate(-50%, -50%) scale(${STANDARD_SCALE})`;
        }

        totalTimePassed += dot.dTime;

        const progress: number = totalTimePassed / TOTAL_DURATION;
        const speedMultiplier: number = 1 + (progress * 1.5);

        // Richtungswechsel-Timer
        if (bHasActiveDirectionChangeTimer) {
            if (timePassedSinceLastDirectionChange > currentDirectionChangeTime) {
                currentPolarity *= -1;
                bHasActiveDirectionChangeTimer = false;
            }
        } else {
            timePassedSinceLastDirectionChange = 0;
            currentDirectionChangeTime = seededGetRandomInBetween(
                minTimePerDirectionChange,
                maxTimePerDirectionChange
            );
            bHasActiveDirectionChangeTimer = true;
        }
        timePassedSinceLastDirectionChange += dot.dTime;

        const newPhaseAngle: number =
            currentPolarity * dot.dTime * dot.velocity * speedMultiplier + lastPhaseAngle;

        dot.X = dot.halfScreen + (Amplitude * Math.cos(newPhaseAngle));
        dot.Y = dot.halfScreen + (Amplitude * Math.sin(newPhaseAngle));

        lastPhaseAngle = newPhaseAngle % (2 * Math.PI);

        const currentScale = STANDARD_SCALE - (progress * (STANDARD_SCALE - MIN_SCALE));
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

    title: "4 Minute Direction Changing Rotation",
    duration: TOTAL_DURATION
};

function TriggerDisappear(dot: Dot): void {
    dot.htmlElement.style.opacity = "0";
    isInvisible = true;
    invisibleTimer = 0;
}