export function withAlpha(hexColor: string, alpha: number): string {
    const hex = hexColor.trim().replace('#', '');
    const fullHex = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex;
    const [red, green, blue] = [0, 2, 4].map((offset) =>
        Number.parseInt(fullHex.slice(offset, offset + 2), 16),
    );

    return `rgb(${red} ${green} ${blue} / ${Math.round(alpha * 100)}%)`;
}
