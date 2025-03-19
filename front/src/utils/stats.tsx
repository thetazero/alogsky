export function normalize(arr: number[]): number[] {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return arr.map((x) => (x - min) / (max - min));
}

export function normalize_within(arr: (number | null)[], min: number, max: number): (number | null)[] {
    return arr.map((x) => {
        if (x === null) return null;
        return (x - min) / (max - min)
    });
}
