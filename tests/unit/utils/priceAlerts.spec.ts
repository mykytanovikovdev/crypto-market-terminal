import { describe, expect, it } from 'vitest';
import {
    getAlertDirection,
    getDistancePercent,
    hasReachedTarget,
    isValidAlertSavedValue,
} from '@/utils/priceAlerts';
import { createAlert } from '../../fixtures/alerts';

describe('price alert rules', () => {
    it('derives the direction from the current price', () => {
        expect(getAlertDirection(85000, 90000)).toBe('above');
        expect(getAlertDirection(85000, 80000)).toBe('below');
        expect(getAlertDirection(85000, 85000)).toBeNull();
    });

    it('fires an above alert at or over the target only', () => {
        const alert = createAlert({ direction: 'above', targetPrice: 90000 });

        expect(hasReachedTarget(alert, 89999.99)).toBe(false);
        expect(hasReachedTarget(alert, 90000)).toBe(true);
        expect(hasReachedTarget(alert, 95000)).toBe(true);
    });

    it('fires a below alert at or under the target only', () => {
        const alert = createAlert({ direction: 'below', targetPrice: 80000 });

        expect(hasReachedTarget(alert, 80000.01)).toBe(false);
        expect(hasReachedTarget(alert, 80000)).toBe(true);
    });

    it('measures the distance to the target in percent', () => {
        expect(getDistancePercent(80000, 88000)).toBeCloseTo(10);
        expect(getDistancePercent(80000, 72000)).toBeCloseTo(-10);
    });

    it('accepts only well-formed saved alerts', () => {
        expect(isValidAlertSavedValue(createAlert())).toBe(true);
        expect(isValidAlertSavedValue({ id: 'x', coinId: 'y', targetPrice: 'high' })).toBe(false);
        expect(isValidAlertSavedValue(null)).toBe(false);
    });
});
