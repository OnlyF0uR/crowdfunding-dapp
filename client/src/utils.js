export function roundNumber(n, dF) {
    // digitFactor:
    // 100 for 2 decimals, 1000 for 3 etc.
    return Math.round(n * dF) / dF;
}