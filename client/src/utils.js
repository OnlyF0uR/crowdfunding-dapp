import { useRef } from "react";

/**
 * roundNumber
 * @param {integer} n the number to round 
 * @param {integer} dF the digitFactor, 100 for 2 decimals, 1000 for 3 decimals etc.
 * @returns the rounded number
 */
export function roundNumber(n, dF) {
    // digitFactor:
    // 100 for 2 decimals, 1000 for 3 etc.
    return Math.round(n * dF) / dF;
}

export const useConstructor = (callBack = () => { }) => {
    const hasBeenCalled = useRef(false);
    if (hasBeenCalled.current) return;
    callBack();
    hasBeenCalled.current = true;
}