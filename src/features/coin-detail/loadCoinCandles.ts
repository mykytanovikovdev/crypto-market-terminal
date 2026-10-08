import { fetchKlines } from '@/api/binance';
import { fetchCoinGeckoCandles } from '@/api/coingecko';
import {
    INDICATOR_WARMUP_CANDLES,
    TIMEFRAME_SETTINGS,
    type ChartTimeframe,
} from '@/features/coin-detail/chartTimeframes';
import type { Candle } from '@/types/market';
import { isPlausibleLivePrice, toBinanceSymbol } from '@/utils/livePrices';

const BINANCE_KLINES_LIMIT = 1000;

export type CandleSource = 'binance' | 'coingecko';

export interface CandleSeries {
    candles: Candle[];
    source: CandleSource;
    pair: string | null;
    intervalMs: number;
}

export interface ChartCoin {
    id: string;
    symbol: string;
    price: number;
}

async function loadBinanceCandles(
    coin: ChartCoin,
    timeframe: ChartTimeframe,
): Promise<CandleSeries | null> {
    const pair = toBinanceSymbol(coin.symbol);

    if (!pair) {
        return null;
    }

    const settings = TIMEFRAME_SETTINGS[timeframe];
    const limit = Math.min(
        settings.visibleCandles + INDICATOR_WARMUP_CANDLES,
        BINANCE_KLINES_LIMIT,
    );

    try {
        const candles = await fetchKlines(pair, settings.binanceInterval, limit);
        const lastCandle = candles.at(-1);

        if (!lastCandle || !isPlausibleLivePrice(coin.price, lastCandle.close)) {
            return null;
        }

        return { candles, source: 'binance', pair, intervalMs: settings.binanceIntervalMs };
    } catch {
        // Binance answers 400 for pairs it does not list and is blocked in some regions;
        // CoinGecko covers every coin, so it serves as the fallback.
        return null;
    }
}

export async function loadCoinCandles(
    coin: ChartCoin,
    timeframe: ChartTimeframe,
): Promise<CandleSeries> {
    const binanceSeries = await loadBinanceCandles(coin, timeframe);

    if (binanceSeries) {
        return binanceSeries;
    }

    const settings = TIMEFRAME_SETTINGS[timeframe];

    return {
        candles: await fetchCoinGeckoCandles(coin.id, settings.coinGeckoDays),
        source: 'coingecko',
        pair: null,
        intervalMs: settings.coinGeckoIntervalMs,
    };
}
