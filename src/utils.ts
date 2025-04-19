export function shuffle<T>(array: T[], seed: number | null = null): T[] {
    let _seed = seed ? seed : new Date().getTime()

    for (let i = array.length - 1; i > 0; i--) {
        let random = Math.sin(_seed * Math.pow(i, 6/7));
        random = (random + 1) / 2
        const j = Math.floor(random * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function radiansToDegrees(angle: number): number {
    return angle * (180 / Math.PI)
}