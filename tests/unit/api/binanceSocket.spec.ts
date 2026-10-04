import { describe, expect, it } from 'vitest';
import { parseTradeMessage } from '@/api/binanceSocket';

describe('parseTradeMessage', () => {
    it('extracts the symbol and numeric price from a trade event', () => {
        const rawMessage = JSON.stringify({
            stream: 'btcusdt@trade',
            data: { e: 'trade', s: 'BTCUSDT', p: '64250.12000000' },
        });

        expect(parseTradeMessage(rawMessage)).toEqual({ symbol: 'BTCUSDT', price: 64250.12 });
    });

    it('ignores messages without trade data', () => {
        expect(parseTradeMessage(JSON.stringify({ result: null, id: 1 }))).toBeNull();
    });
});
