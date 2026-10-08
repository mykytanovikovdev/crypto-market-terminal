import { defineStore } from 'pinia';
import { computed, ref, shallowRef, watch } from 'vue';
import type { AlertCoin, PriceAlert } from '@/types/alert';
import { getAlertDirection, hasReachedTarget, isValidAlertSavedValue } from '@/utils/priceAlerts';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

function readSavedAlerts(): PriceAlert[] {
    try {
        const parsed: unknown = JSON.parse(readStorage(STORAGE_KEYS.alerts) ?? '[]');

        return Array.isArray(parsed) ? parsed.filter(isValidAlertSavedValue) : [];
    } catch {
        return [];
    }
}

function createAlertId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAlertsStore = defineStore('alerts', () => {
    const alerts = ref<PriceAlert[]>(readSavedAlerts());
    const latestPrices = shallowRef<Record<string, number>>({});

    const activeAlerts = computed(() => alerts.value.filter((alert) => alert.triggeredAt === null));
    const triggeredAlerts = computed(() =>
        alerts.value
            .filter((alert) => alert.triggeredAt !== null)
            .sort((first, second) => (second.triggeredAt ?? 0) - (first.triggeredAt ?? 0)),
    );

    function getActiveAlertsForCoin(coinId: string): PriceAlert[] {
        return activeAlerts.value.filter((alert) => alert.coinId === coinId);
    }

    function createAlert(
        coin: AlertCoin,
        targetPrice: number,
        currentPrice: number,
    ): PriceAlert | null {
        const direction = getAlertDirection(currentPrice, targetPrice);

        if (!direction || targetPrice <= 0) {
            return null;
        }

        const alert: PriceAlert = {
            id: createAlertId(),
            coinId: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            imageUrl: coin.imageUrl,
            targetPrice,
            referencePrice: currentPrice,
            direction,
            createdAt: Date.now(),
            triggeredAt: null,
            triggeredPrice: null,
        };

        alerts.value = [...alerts.value, alert];

        return alert;
    }

    function removeAlert(alertId: string): void {
        alerts.value = alerts.value.filter((alert) => alert.id !== alertId);
    }

    function rearmAlert(alertId: string, currentPrice: number): boolean {
        const alert = alerts.value.find((item) => item.id === alertId);
        const direction = alert ? getAlertDirection(currentPrice, alert.targetPrice) : null;

        if (!alert || !direction) {
            return false;
        }

        alerts.value = alerts.value.map((item) =>
            item.id === alertId
                ? {
                      ...item,
                      direction,
                      referencePrice: currentPrice,
                      triggeredAt: null,
                      triggeredPrice: null,
                  }
                : item,
        );

        return true;
    }

    function recordPrices(prices: Record<string, number>): PriceAlert[] {
        latestPrices.value = { ...latestPrices.value, ...prices };

        const now = Date.now();
        const triggered = activeAlerts.value
            .filter((alert) => {
                const price = prices[alert.coinId];

                return price !== undefined && hasReachedTarget(alert, price);
            })
            .map((alert) => ({
                ...alert,
                triggeredAt: now,
                triggeredPrice: prices[alert.coinId] ?? null,
            }));

        if (triggered.length > 0) {
            const triggeredById = new Map(triggered.map((alert) => [alert.id, alert]));

            alerts.value = alerts.value.map((alert) => triggeredById.get(alert.id) ?? alert);
        }

        return triggered;
    }

    function saveAlerts(value: PriceAlert[]): void {
        writeStorage(STORAGE_KEYS.alerts, JSON.stringify(value));
    }

    watch(alerts, saveAlerts);

    return {
        alerts,
        latestPrices,
        activeAlerts,
        triggeredAlerts,
        getActiveAlertsForCoin,
        createAlert,
        removeAlert,
        rearmAlert,
        recordPrices,
    };
});
