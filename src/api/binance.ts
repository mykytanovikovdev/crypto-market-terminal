import { createHttpClient } from '@/api/http';
import type { BinanceKlineDto } from '@/types/binance';
import type { Candle } from '@/types/market';

const BINANCE_API_URL = 'https://api.binance.com/api/v3';

export type BinanceInterval = '15m' | '1h' | '4h' | '12h' | '1d';

export const binanceClient = createHttpClient(BINANCE_API_URL);

export function mapKlineToCandle([
    openTimeMs,
    open,
    high,
    low,
    close,
    volume,
]: BinanceKlineDto): Candle {
    return {
        time: Math.floor(openTimeMs / 1000),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume),
    };
}

export async function fetchKlines(
    symbol: string,
    interval: BinanceInterval,
    limit: number,
): Promise<Candle[]> {
    const { data } = await binanceClient.get<BinanceKlineDto[]>('/klines', {
        params: { symbol, interval, limit },
    });

    return data.map(mapKlineToCandle);
}
