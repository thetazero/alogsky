export function normalize(arr: number[]): number[] {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map((x) => (x - min) / (max - min));
}

export function normalize_within(arr: number[], min: number, max: number): number[] {
    return arr.map((x) => (x - min) / (max - min));
}
