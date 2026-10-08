export function calculateSma(values: number[], period: number): (number | null)[] {
    let windowSum = 0;

    return values.map((value, index) => {
        windowSum += value;

        if (index >= period) {
            windowSum -= values[index - period] ?? 0;
        }

        return index >= period - 1 ? windowSum / period : null;
    });
}

function toRsi(averageGain: number, averageLoss: number): number {
    if (averageLoss === 0) {
        return averageGain === 0 ? 50 : 100;
    }

    return 100 - 100 / (1 + averageGain / averageLoss);
}

// Wilder's smoothing, the same RSI definition that TradingView and most exchanges use.
export function calculateRsi(values: number[], period = 14): (number | null)[] {
    const result: (number | null)[] = values.map(() => null);
    let averageGain = 0;
    let averageLoss = 0;

    for (let index = 1; index < values.length; index += 1) {
        const change = (values[index] ?? 0) - (values[index - 1] ?? 0);
        const gain = Math.max(change, 0);
        const loss = Math.max(-change, 0);

        if (index <= period) {
            averageGain += gain / period;
            averageLoss += loss / period;
        } else {
            averageGain = (averageGain * (period - 1) + gain) / period;
            averageLoss = (averageLoss * (period - 1) + loss) / period;
        }

        if (index >= period) {
            result[index] = toRsi(averageGain, averageLoss);
        }
    }

    return result;
}
