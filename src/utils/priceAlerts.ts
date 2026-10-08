import type { AlertDirection, PriceAlert } from '@/types/alert';

export function getAlertDirection(
    currentPrice: number,
    targetPrice: number,
): AlertDirection | null {
    if (targetPrice === currentPrice) {
        return null;
    }

    return targetPrice > currentPrice ? 'above' : 'below';
}

// The direction is chosen so the price starts on the other side of the target, which makes
// "has reached the target" equivalent to "has crossed it" — including while the site was closed.
export function hasReachedTarget(alert: PriceAlert, price: number): boolean {
    return alert.direction === 'above' ? price >= alert.targetPrice : price <= alert.targetPrice;
}

export function getDistancePercent(currentPrice: number, targetPrice: number): number {
    return ((targetPrice - currentPrice) / currentPrice) * 100;
}

export function isValidAlertSavedValue(value: unknown): value is PriceAlert {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const alert = value as Partial<PriceAlert>;

    return (
        typeof alert.id === 'string' &&
        typeof alert.coinId === 'string' &&
        typeof alert.targetPrice === 'number' &&
        (alert.direction === 'above' || alert.direction === 'below')
    );
}
