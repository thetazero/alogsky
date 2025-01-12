export function ellipses_text(str: string, len: number): string {
    if (str.length > len - 3) {
        return str.substring(0, len - 3) + '...';
    }
    return str;
}
