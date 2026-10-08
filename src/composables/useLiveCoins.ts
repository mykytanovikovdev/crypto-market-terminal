import { computed, onBeforeUnmount, watch, type ComputedRef, type Ref } from 'vue';
import { useLiveTickerStore } from '@/stores/liveTicker';
import type { LiveTrackableCoin } from '@/types/market';
import { applyLiveQuote } from '@/utils/livePrices';

const TRACKING_DEBOUNCE_MS = 400;

export function useLiveCoins<TCoin extends LiveTrackableCoin>(
    coins: Ref<TCoin[]>,
): ComputedRef<TCoin[]> {
    const liveTicker = useLiveTickerStore();
    let trackingTimer: ReturnType<typeof setTimeout> | null = null;

    function trackCurrentCoins(): void {
        trackingTimer = null;
        liveTicker.trackCoins(coins.value);
    }

    function scheduleTracking(): void {
        if (trackingTimer !== null) {
            clearTimeout(trackingTimer);
        }

        trackingTimer = setTimeout(trackCurrentCoins, TRACKING_DEBOUNCE_MS);
    }

    function stopLiveTracking(): void {
        if (trackingTimer !== null) {
            clearTimeout(trackingTimer);
        }

        liveTicker.stopTracking();
    }

    watch(coins, scheduleTracking, { immediate: true });
    onBeforeUnmount(stopLiveTracking);

    return computed(() =>
        coins.value.map((coin) => applyLiveQuote(coin, liveTicker.quotes[coin.id])),
    );
}
