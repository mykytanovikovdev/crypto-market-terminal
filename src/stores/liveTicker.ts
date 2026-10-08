import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { createTickerConnection } from '@/api/binanceSocket';
import type {
    LiveConnectionStatus,
    LiveQuote,
    LiveTrackableCoin,
    TickerUpdate,
} from '@/types/market';
import { isPlausibleLivePrice, toBinanceSymbol, toLiveQuote } from '@/utils/livePrices';

const FLUSH_INTERVAL_MS = 1_000;
const DISCONNECT_GRACE_MS = 3_000;

function groupCoinsBySymbol(coins: LiveTrackableCoin[]): Map<string, LiveTrackableCoin[]> {
    const coinsBySymbol = new Map<string, LiveTrackableCoin[]>();

    for (const coin of coins) {
        const symbol = toBinanceSymbol(coin.symbol);

        if (symbol) {
            coinsBySymbol.set(symbol, [...(coinsBySymbol.get(symbol) ?? []), coin]);
        }
    }

    return coinsBySymbol;
}

export type TrackingSource = 'page' | 'alerts';

export const useLiveTickerStore = defineStore('liveTicker', () => {
    const status = ref<LiveConnectionStatus>('idle');
    const quotes = shallowRef<Record<string, LiveQuote>>({});

    const coinsBySource: Record<TrackingSource, LiveTrackableCoin[]> = { page: [], alerts: [] };
    let trackedCoins = new Map<string, LiveTrackableCoin[]>();
    let isDocumentHidden = document.hidden;
    const pendingUpdates = new Map<string, TickerUpdate>();
    let flushTimer: ReturnType<typeof setTimeout> | null = null;
    let disconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function setStatus(nextStatus: LiveConnectionStatus): void {
        status.value = nextStatus;
    }

    function flushUpdates(): void {
        flushTimer = null;
        const nextQuotes = { ...quotes.value };

        for (const update of pendingUpdates.values()) {
            for (const coin of trackedCoins.get(update.symbol) ?? []) {
                if (isPlausibleLivePrice(coin.price, update.lastPrice)) {
                    nextQuotes[coin.id] = toLiveQuote(update);
                }
            }
        }

        pendingUpdates.clear();
        quotes.value = nextQuotes;
    }

    function queueUpdate(update: TickerUpdate): void {
        pendingUpdates.set(update.symbol, update);
        flushTimer ??= setTimeout(flushUpdates, FLUSH_INTERVAL_MS);
    }

    const connection = createTickerConnection({
        onUpdate: queueUpdate,
        onStatusChange: setStatus,
    });

    function cancelPendingDisconnect(): void {
        if (disconnectTimer !== null) {
            clearTimeout(disconnectTimer);
            disconnectTimer = null;
        }
    }

    function mergeSources(sources: TrackingSource[]): LiveTrackableCoin[] {
        const coinsById = new Map<string, LiveTrackableCoin>();

        for (const source of sources) {
            for (const coin of coinsBySource[source]) {
                if (!coinsById.has(coin.id)) {
                    coinsById.set(coin.id, coin);
                }
            }
        }

        return [...coinsById.values()];
    }

    function keepQuotesForTrackedCoins(): void {
        const trackedIds = new Set([...trackedCoins.values()].flat().map((coin) => coin.id));
        const keptEntries = Object.entries(quotes.value).filter(([coinId]) =>
            trackedIds.has(coinId),
        );

        if (keptEntries.length !== Object.keys(quotes.value).length) {
            quotes.value = Object.fromEntries(keptEntries);
        }
    }

    // While the tab is hidden only alert coins stay subscribed, so alerts can still fire;
    // quotes of page coins are kept so the table does not fall back to stale prices on return.
    function applySubscriptions(): void {
        trackedCoins = groupCoinsBySymbol(mergeSources(['page', 'alerts']));
        keepQuotesForTrackedCoins();

        const subscribedCoins = isDocumentHidden
            ? coinsBySource.alerts
            : mergeSources(['page', 'alerts']);

        if (isDocumentHidden && subscribedCoins.length === 0) {
            connection.pause();

            return;
        }

        connection.resume();
        connection.setSymbols([...groupCoinsBySymbol(subscribedCoins).keys()]);
    }

    function trackCoins(coins: LiveTrackableCoin[], source: TrackingSource = 'page'): void {
        if (source === 'page') {
            cancelPendingDisconnect();
        }

        coinsBySource[source] = coins;
        applySubscriptions();
    }

    function releasePageCoins(): void {
        disconnectTimer = null;
        trackCoins([], 'page');
    }

    function stopTracking(): void {
        cancelPendingDisconnect();
        disconnectTimer = setTimeout(releasePageCoins, DISCONNECT_GRACE_MS);
    }

    function handleVisibilityChange(): void {
        isDocumentHidden = document.hidden;
        applySubscriptions();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return { status, quotes, trackCoins, stopTracking };
});
