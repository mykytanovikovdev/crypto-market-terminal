import { computed, ref, watch } from 'vue';
import { readQueryString, useRouteQuery } from '@/composables/useRouteQuery';
import type { ChartType } from '@/features/coin-detail/chart/priceChart';
import {
    DEFAULT_TIMEFRAME,
    isChartTimeframe,
    type ChartTimeframe,
} from '@/features/coin-detail/chartTimeframes';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage';

interface StoredChartSettings {
    chartType: ChartType;
    showSma: boolean;
    showRsi: boolean;
}

const DEFAULT_SETTINGS: StoredChartSettings = {
    chartType: 'candles',
    showSma: true,
    showRsi: true,
};

function readStoredSettings(): StoredChartSettings {
    try {
        const parsed: unknown = JSON.parse(readStorage(STORAGE_KEYS.chartSettings) ?? 'null');

        if (typeof parsed !== 'object' || parsed === null) {
            return DEFAULT_SETTINGS;
        }

        const stored = parsed as Partial<StoredChartSettings>;

        return {
            chartType: stored.chartType === 'line' ? 'line' : 'candles',
            showSma: stored.showSma ?? DEFAULT_SETTINGS.showSma,
            showRsi: stored.showRsi ?? DEFAULT_SETTINGS.showRsi,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function useChartSettings() {
    const { route, updateQuery } = useRouteQuery();
    const settings = ref<StoredChartSettings>(readStoredSettings());

    const timeframe = computed<ChartTimeframe>({
        get: () => {
            const range = readQueryString(route.query, 'range');

            return isChartTimeframe(range) ? range : DEFAULT_TIMEFRAME;
        },
        set: (value) => updateQuery({ range: value === DEFAULT_TIMEFRAME ? undefined : value }),
    });

    const chartType = computed<ChartType>({
        get: () => settings.value.chartType,
        set: (value) => (settings.value = { ...settings.value, chartType: value }),
    });

    const showSma = computed<boolean>({
        get: () => settings.value.showSma,
        set: (value) => (settings.value = { ...settings.value, showSma: value }),
    });

    const showRsi = computed<boolean>({
        get: () => settings.value.showRsi,
        set: (value) => (settings.value = { ...settings.value, showRsi: value }),
    });

    function saveSettings(value: StoredChartSettings): void {
        writeStorage(STORAGE_KEYS.chartSettings, JSON.stringify(value));
    }

    watch(settings, saveSettings);

    return { timeframe, chartType, showSma, showRsi };
}
