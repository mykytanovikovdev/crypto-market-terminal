import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { useAlertsStore } from '@/stores/alerts';
import { STORAGE_KEYS } from '@/utils/storage';
import { bitcoinAlertCoin } from '../../fixtures/alerts';

describe('alerts store', () => {
    beforeEach(() => {
        localStorage.clear();
        setActivePinia(createPinia());
    });

    it('creates an alert with the direction derived from the current price', () => {
        const store = useAlertsStore();

        const alert = store.createAlert(bitcoinAlertCoin, 90000, 85000);

        expect(alert).toMatchObject({
            coinId: 'bitcoin',
            direction: 'above',
            referencePrice: 85000,
        });
        expect(store.activeAlerts).toHaveLength(1);
        expect(store.getActiveAlertsForCoin('bitcoin')).toHaveLength(1);
    });

    it('refuses a target equal to the current price or not positive', () => {
        const store = useAlertsStore();

        expect(store.createAlert(bitcoinAlertCoin, 85000, 85000)).toBeNull();
        expect(store.createAlert(bitcoinAlertCoin, 0, 85000)).toBeNull();
        expect(store.alerts).toHaveLength(0);
    });

    it('fires each alert once and returns only the newly triggered ones', () => {
        const store = useAlertsStore();
        store.createAlert(bitcoinAlertCoin, 90000, 85000);

        expect(store.recordPrices({ bitcoin: 89000 })).toEqual([]);

        const triggered = store.recordPrices({ bitcoin: 90100 });

        expect(triggered).toHaveLength(1);
        expect(triggered[0]).toMatchObject({ triggeredPrice: 90100 });
        expect(store.recordPrices({ bitcoin: 91000 })).toEqual([]);
        expect(store.activeAlerts).toHaveLength(0);
        expect(store.triggeredAlerts).toHaveLength(1);
    });

    it('keeps the alerts array untouched when nothing fires', () => {
        const store = useAlertsStore();
        store.createAlert(bitcoinAlertCoin, 90000, 85000);
        const alertsBefore = store.alerts;

        store.recordPrices({ bitcoin: 86000, ethereum: 3000 });

        expect(store.alerts).toBe(alertsBefore);
        expect(store.latestPrices).toEqual({ bitcoin: 86000, ethereum: 3000 });
    });

    it('re-arms a triggered alert relative to the current price', () => {
        const store = useAlertsStore();
        const alert = store.createAlert(bitcoinAlertCoin, 90000, 85000)!;
        store.recordPrices({ bitcoin: 92000 });

        expect(store.rearmAlert(alert.id, 92000)).toBe(true);

        expect(store.activeAlerts[0]).toMatchObject({
            direction: 'below',
            referencePrice: 92000,
            triggeredAt: null,
        });
    });

    it('removes alerts', () => {
        const store = useAlertsStore();
        const alert = store.createAlert(bitcoinAlertCoin, 90000, 85000)!;

        store.removeAlert(alert.id);

        expect(store.alerts).toEqual([]);
    });

    it('persists alerts and ignores corrupted storage', async () => {
        useAlertsStore().createAlert(bitcoinAlertCoin, 90000, 85000);
        await nextTick();

        setActivePinia(createPinia());
        expect(useAlertsStore().alerts).toHaveLength(1);

        localStorage.setItem(STORAGE_KEYS.alerts, '{broken');
        setActivePinia(createPinia());
        expect(useAlertsStore().alerts).toEqual([]);
    });
});
