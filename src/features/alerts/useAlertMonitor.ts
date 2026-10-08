import { computed, onBeforeUnmount, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchCoinsByIds } from '@/api/coingecko';
import { useLocale } from '@/composables/useLocale';
import { useAlertsStore } from '@/stores/alerts';
import { useLiveTickerStore } from '@/stores/liveTicker';
import { useToastStore } from '@/stores/toasts';
import type { PriceAlert } from '@/types/alert';
import type { LiveQuote, LiveTrackableCoin } from '@/types/market';
import { showBrowserNotification } from '@/utils/browserNotifications';
import { formatPrice } from '@/utils/format';

export const ALERT_POLL_INTERVAL_MS = 60_000;

export function useAlertMonitor() {
    const alertsStore = useAlertsStore();
    const liveTicker = useLiveTickerStore();
    const toastStore = useToastStore();
    const { t } = useI18n();
    const { numberLocale } = useLocale();
    const referencePrices = shallowRef<Record<string, number>>({});
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const alertCoinIds = computed(() => [
        ...new Set(alertsStore.activeAlerts.map((alert) => alert.coinId)),
    ]);

    const trackedAlertCoins = computed<LiveTrackableCoin[]>(() =>
        alertCoinIds.value.flatMap((coinId) => {
            const alert = alertsStore.activeAlerts.find((item) => item.coinId === coinId);

            return alert
                ? [
                      {
                          id: coinId,
                          symbol: alert.symbol,
                          price: referencePrices.value[coinId] ?? alert.referencePrice,
                          change24h: null,
                      },
                  ]
                : [];
        }),
    );

    function notify(alert: PriceAlert): void {
        const symbol = alert.symbol.toUpperCase();
        const title = t('alerts.notificationTitle', { symbol });
        const body = t(`alerts.notificationBody.${alert.direction}`, {
            name: alert.name,
            target: formatPrice(alert.targetPrice, numberLocale.value),
            price: formatPrice(alert.triggeredPrice ?? alert.targetPrice, numberLocale.value),
        });

        showBrowserNotification(title, body, alert.imageUrl);
        toastStore.showToast({ title, body, imageUrl: alert.imageUrl });
    }

    function evaluatePrices(prices: Record<string, number>): void {
        for (const alert of alertsStore.recordPrices(prices)) {
            notify(alert);
        }
    }

    function evaluateLiveQuotes(quotes: Record<string, LiveQuote>): void {
        evaluatePrices(
            Object.fromEntries(
                Object.entries(quotes).map(([coinId, quote]) => [coinId, quote.price]),
            ),
        );
    }

    // CoinGecko lags behind Binance; coins with a live quote are judged only by the price the
    // user sees, otherwise an alert could fire on a stale price that is not on the screen.
    function withoutLiveCoins(prices: Record<string, number>): Record<string, number> {
        return Object.fromEntries(
            Object.entries(prices).filter(([coinId]) => liveTicker.quotes[coinId] === undefined),
        );
    }

    async function pollAlertPrices(): Promise<void> {
        if (alertCoinIds.value.length === 0) {
            return;
        }

        try {
            const coins = await fetchCoinsByIds(alertCoinIds.value);
            const prices = Object.fromEntries(coins.map((coin) => [coin.id, coin.price]));

            referencePrices.value = { ...referencePrices.value, ...prices };
            evaluatePrices(withoutLiveCoins(prices));
        } catch {
            // A failed poll is retried on the next interval; Binance prices keep flowing meanwhile.
        }
    }

    function stopPolling(): void {
        if (pollTimer !== null) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }

    function updatePolling(hasActiveAlerts: boolean): void {
        if (hasActiveAlerts && pollTimer === null) {
            void pollAlertPrices();
            pollTimer = setInterval(pollAlertPrices, ALERT_POLL_INTERVAL_MS);
        } else if (!hasActiveAlerts) {
            stopPolling();
        }
    }

    function trackAlertCoins(coins: LiveTrackableCoin[]): void {
        liveTicker.trackCoins(coins, 'alerts');
    }

    watch(trackedAlertCoins, trackAlertCoins, { immediate: true });
    watch(() => liveTicker.quotes, evaluateLiveQuotes);
    watch(() => alertCoinIds.value.length > 0, updatePolling, { immediate: true });
    onBeforeUnmount(stopPolling);
}
