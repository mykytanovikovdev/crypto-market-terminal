import { describe, expect, it, vi } from 'vitest';
import { fetchKlines } from '@/api/binance';
import { fetchCoinGeckoCandles } from '@/api/coingecko';
import { ApiError } from '@/api/http';
import { loadCoinCandles } from '@/features/coin-detail/loadCoinCandles';
import { createHourlyCandles } from '../../../fixtures/coinDetails';

vi.mock('@/api/binance', () => ({ fetchKlines: vi.fn() }));
vi.mock('@/api/coingecko', () => ({ fetchCoinGeckoCandles: vi.fn() }));

const bitcoin = { id: 'bitcoin', symbol: 'btc', price: 110 };

describe('loadCoinCandles', () => {
    it('uses Binance klines with indicator warm-up when the pair matches the price', async () => {
        vi.mocked(fetchKlines).mockResolvedValue(createHourlyCandles([100, 110]));

        const series = await loadCoinCandles(bitcoin, '7D');

        expect(fetchKlines).toHaveBeenCalledWith('BTCUSDT', '1h', 218);
        expect(series).toMatchObject({ source: 'binance', pair: 'BTCUSDT', intervalMs: 3_600_000 });
        expect(fetchCoinGeckoCandles).not.toHaveBeenCalled();
    });

    it('falls back to CoinGecko when Binance does not list the pair', async () => {
        vi.mocked(fetchKlines).mockRejectedValue(new ApiError('http', 'Invalid symbol', 400));
        vi.mocked(fetchCoinGeckoCandles).mockResolvedValue(createHourlyCandles([100], false));

        const series = await loadCoinCandles(bitcoin, '1Y');

        expect(fetchCoinGeckoCandles).toHaveBeenCalledWith('bitcoin', 365);
        expect(series).toMatchObject({ source: 'coingecko', pair: null, intervalMs: 345_600_000 });
    });

    it('falls back to CoinGecko when the Binance pair belongs to another coin', async () => {
        vi.mocked(fetchKlines).mockResolvedValue(createHourlyCandles([5, 6]));
        vi.mocked(fetchCoinGeckoCandles).mockResolvedValue(createHourlyCandles([110], false));

        expect((await loadCoinCandles(bitcoin, '7D')).source).toBe('coingecko');
    });

    it('goes straight to CoinGecko for tickers Binance cannot have', async () => {
        vi.mocked(fetchCoinGeckoCandles).mockResolvedValue(createHourlyCandles([1], false));

        await loadCoinCandles({ id: 'tether', symbol: 'usdt', price: 1 }, '1D');

        expect(fetchKlines).not.toHaveBeenCalled();
        expect(fetchCoinGeckoCandles).toHaveBeenCalledWith('tether', 1);
    });
});
