import { describe, expect, it } from 'vitest';
import {
    applyLiveQuote,
    isPlausibleLivePrice,
    toBinanceSymbol,
    toLiveQuote,
} from '@/utils/livePrices';
import { coinListings } from '../../fixtures/coingecko';

describe('toBinanceSymbol', () => {
    it('maps a coin ticker to its USDT pair', () => {
        expect(toBinanceSymbol('btc')).toBe('BTCUSDT');
    });

    it('skips the quote asset itself and tickers Binance cannot list', () => {
        expect(toBinanceSymbol('usdt')).toBeNull();
        expect(toBinanceSymbol('figr_heloc')).toBeNull();
        expect(toBinanceSymbol('m')).toBeNull();
    });
});

describe('isPlausibleLivePrice', () => {
    it('accepts prices within 10% of the reference', () => {
        expect(isPlausibleLivePrice(100, 109)).toBe(true);
        expect(isPlausibleLivePrice(100, 91)).toBe(true);
    });

    it('rejects prices that belong to a different coin with the same ticker', () => {
        expect(isPlausibleLivePrice(100, 112)).toBe(false);
        expect(isPlausibleLivePrice(0.5, 30)).toBe(false);
        expect(isPlausibleLivePrice(0, 1)).toBe(false);
    });
});

describe('live quotes', () => {
    it('derives the 24h change from the rolling open price', () => {
        expect(toLiveQuote({ symbol: 'BTCUSDT', lastPrice: 110, openPrice: 100 })).toEqual({
            price: 110,
            change24h: 10,
        });
    });

    it('overrides price and 24h change but keeps the rest of the listing', () => {
        const [bitcoin] = coinListings;
        const liveBitcoin = applyLiveQuote(bitcoin!, { price: 65000, change24h: 1.5 });

        expect(liveBitcoin).toEqual({ ...bitcoin, price: 65000, change24h: 1.5 });
        expect(applyLiveQuote(bitcoin!, undefined)).toBe(bitcoin);
    });
});
