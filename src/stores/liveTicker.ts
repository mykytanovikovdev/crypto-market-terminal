import { defineStore } from 'pinia';
import { ref, shallowRef } from 'vue';
import { createTickerConnection } from '@/api/binanceSocket';
import type { CoinListing, LiveConnectionStatus, LiveQuote, TickerUpdate } from '@/types/market';
import { isPlausibleLivePrice, toBinanceSymbol, toLiveQuote } from '@/utils/livePrices';

const FLUSH_INTERVAL_MS = 1_000;
const DISCONNECT_GRACE_MS = 3_000;

function groupCoinsBySymbol(coins: CoinListing[]): Map<string, CoinListing[]> {
    const coinsBySymbol = new Map<string, CoinListing[]>();

    for (const coin of coins) {
        const symbol = toBinanceSymbol(coin.symbol);

        if (symbol) {
            coinsBySymbol.set(symbol, [...(coinsBySymbol.get(symbol) ?? []), coin]);
        }
    }

    return coinsBySymbol;
}

export const useLiveTickerStore = defineStore('liveTicker', () => {
    const status = ref<LiveConnectionStatus>('idle');
    const quotes = shallowRef<Record<string, LiveQuote>>({});

    let trackedCoins = new Map<string, CoinListing[]>();
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

    function keepQuotesForTrackedCoins(): void {
        const trackedIds = new Set([...trackedCoins.values()].flat().map((coin) => coin.id));

        quotes.value = Object.fromEntries(
            Object.entries(quotes.value).filter(([coinId]) => trackedIds.has(coinId)),
        );
    }

    function trackCoins(coins: CoinListing[]): void {
        cancelPendingDisconnect();
        trackedCoins = groupCoinsBySymbol(coins);
        keepQuotesForTrackedCoins();
        connection.setSymbols([...trackedCoins.keys()]);
    }

    function disconnect(): void {
        disconnectTimer = null;
        trackCoins([]);
    }

    function stopTracking(): void {
        cancelPendingDisconnect();
        disconnectTimer = setTimeout(disconnect, DISCONNECT_GRACE_MS);
    }

    function handleVisibilityChange(): void {
        if (document.hidden) {
            connection.pause();
        } else {
            connection.resume();
        }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return { status, quotes, trackCoins, stopTracking };
});
