const MAX_POINTS = 56;

function downsample(points: number[], maxPoints: number): number[] {
    if (points.length <= maxPoints) {
        return points;
    }

    const step = (points.length - 1) / (maxPoints - 1);

    return Array.from({ length: maxPoints }, (_, index) => points[Math.round(index * step)] ?? 0);
}

export function buildSparklinePath(points: number[], width: number, height: number): string {
    const series = downsample(points, MAX_POINTS);

    if (series.length < 2) {
        return '';
    }

    const min = Math.min(...series);
    const range = Math.max(...series) - min || 1;
    const stepX = width / (series.length - 1);

    return series
        .map((value, index) => {
            const x = (index * stepX).toFixed(2);
            const y = (height - ((value - min) / range) * height).toFixed(2);

            return `${index === 0 ? 'M' : 'L'}${x},${y}`;
        })
        .join(' ');
}
