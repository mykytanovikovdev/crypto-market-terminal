import type { AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { binanceClient, fetchKlines } from '@/api/binance';

describe('fetchKlines', () => {
    it('requests klines and maps them to candles with volume', async () => {
        const getSpy = vi.spyOn(binanceClient, 'get').mockResolvedValue({
            data: [
                [1_790_000_000_000, '100.5', '110', '99', '105.25', '1234.5', 1_790_003_599_999],
            ],
        } as AxiosResponse);

        const candles = await fetchKlines('BTCUSDT', '1h', 218);

        expect(getSpy).toHaveBeenCalledWith('/klines', {
            params: { symbol: 'BTCUSDT', interval: '1h', limit: 218 },
        });
        expect(candles).toEqual([
            { time: 1_790_000_000, open: 100.5, high: 110, low: 99, close: 105.25, volume: 1234.5 },
        ]);
    });
});
