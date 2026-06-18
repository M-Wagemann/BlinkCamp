
import { DirectionChangingRotationsRoutine } from './Routines/DirectionChangingRotationsRoutine.js';
import { DirectionChangingLeftRight } from './Routines/DirectionChangingLeftRight.js';
import { PeekabooRoutine } from './Routines/PeekabooRoutine.js';
import { InverseWaveRoutine } from './Routines/InverseWaveRoutine.js';
import { CounterClockwiseRotationRoutine } from "./Routines/CounterClockwiseRotationRoutine.js";
import { ClockwiseRotationRoutine } from "./Routines/ClockwiseRotationRoutine.js";
import { ElasticCollisionRoutine } from "./Routines/ElasticCollisionRoutine.js";
import { LeftRightRoutine } from "./Routines/LeftRightRoutine.js";
import { UpDownRoutine } from "./Routines/UpDownRoutine.js";
import { DiagonalUpwardRoutine } from "./Routines/DiagonalUpwardRoutine.js";
import { DiagonalDownwardRoutine } from './Routines/DiagonalDownwardRoutine.js';
import { WaveRoutine } from "./Routines/WaveRoutine.js";
import { IDotRoutine } from "./IDotRoutine.js";
import { TwoMinuteCircleRoutine } from './Routines/TwoMinuteCircleRoutine.js';
import { TwoMinuteWaveRoutine } from "./Routines/TwoMinuteWaveRoutine.js";
import { TwoMinuteDirectionChangingCircleRoutine } from "./Routines/TwoMinuteDirectionChangingCircleRoutine.js";
import { TwoMinuteDirectionChangingWaveRoutine } from "./Routines/TwoMinuteDirectionChangingWaveRoutine.js"


let RoutineChanged = new CustomEvent('DotRoutineManager:RoutineChanged');

const RoutineManager: { activeDotRoutines: Array<IDotRoutine>, currentRoutineIndex: number} = {
    activeDotRoutines: [
        TwoMinuteCircleRoutine,               // Index 0 - Block 1
        TwoMinuteWaveRoutine,                 // Index 1 - Block 2
        TwoMinuteDirectionChangingCircleRoutine, // Index 2 - Block 3
        TwoMinuteDirectionChangingWaveRoutine,   // Index 3 - Block 4
        CounterClockwiseRotationRoutine,
        ClockwiseRotationRoutine,
        DirectionChangingRotationsRoutine,
        ElasticCollisionRoutine,
        LeftRightRoutine,
        DirectionChangingLeftRight,
        UpDownRoutine,
        DiagonalUpwardRoutine,
        DiagonalDownwardRoutine,
        WaveRoutine,
        InverseWaveRoutine,
        PeekabooRoutine
    ],
    currentRoutineIndex: 0,
};


window.addEventListener('Game:LeftArrowClick', () => {
    let newIndex = RoutineManager.currentRoutineIndex - 1;
    newIndex = newIndex < 0 ? RoutineManager.activeDotRoutines.length -1 : newIndex;
    RoutineManager.currentRoutineIndex = newIndex;
    window.dispatchEvent(RoutineChanged);
})

window.addEventListener('Game:RightArrowClick', () => {
    RoutineManager.currentRoutineIndex = (RoutineManager.currentRoutineIndex + 1) % RoutineManager.activeDotRoutines.length;
    window.dispatchEvent(RoutineChanged);
})


export default RoutineManager
