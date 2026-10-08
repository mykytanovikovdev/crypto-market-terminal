import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTickerConnection, type TickerConnectionHandlers } from '@/api/binanceSocket';
import { useLiveTickerStore } from '@/stores/liveTicker';
import { coinListings } from '../../fixtures/coingecko';

import {
    createTickerConnectionMock,
    type TickerConnectionMock,
} from '../../helpers/tickerConnectionMock';

vi.mock('@/api/binanceSocket', () => ({ createTickerConnection: vi.fn() }));

let handlers: TickerConnectionHandlers;
let connection: TickerConnectionMock;

function setDocumentHidden(hidden: boolean): void {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    document.dispatchEvent(new Event('visibilitychange'));
}

describe('live ticker store', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        connection = createTickerConnectionMock();
        vi.mocked(createTickerConnection).mockImplementation((connectionHandlers) => {
            handlers = connectionHandlers;

            return connection;
        });
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('subscribes to the Binance pairs of tracked coins', () => {
        useLiveTickerStore().trackCoins(coinListings);

        expect(connection.setSymbols).toHaveBeenCalledWith(['BTCUSDT', 'LTCUSDT', 'NEWUSDT']);
    });

    it('mirrors the connection status', () => {
        const store = useLiveTickerStore();

        handlers.onStatusChange('live');

        expect(store.status).toBe('live');
    });

    it('applies ticker updates in one batch per second', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings);

        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 64000, openPrice: 62000 });
        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 64100, openPrice: 62000 });
        expect(store.quotes).toEqual({});

        vi.advanceTimersByTime(1_000);

        expect(store.quotes.bitcoin?.price).toBe(64100);
    });

    it('ignores live prices that do not match the CoinGecko reference', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings);

        handlers.onUpdate({ symbol: 'LTCUSDT', lastPrice: 1.2, openPrice: 1.1 });
        vi.advanceTimersByTime(1_000);

        expect(store.quotes.litecoin).toBeUndefined();
    });

    it('keeps the connection briefly after tracking stops so navigation can reuse it', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings);

        store.stopTracking();
        vi.advanceTimersByTime(2_000);
        store.trackCoins(coinListings.slice(0, 1));
        vi.advanceTimersByTime(5_000);

        expect(connection.setSymbols).not.toHaveBeenCalledWith([]);

        store.stopTracking();
        vi.advanceTimersByTime(3_000);

        expect(connection.setSymbols).toHaveBeenLastCalledWith([]);
    });

    it('drops quotes of coins that are no longer tracked', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings);
        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 64000, openPrice: 62000 });
        vi.advanceTimersByTime(1_000);

        store.trackCoins(coinListings.slice(1));

        expect(store.quotes.bitcoin).toBeUndefined();
    });

    it('pauses while the tab is hidden and resumes when it is visible again', () => {
        useLiveTickerStore();

        setDocumentHidden(true);
        expect(connection.pause).toHaveBeenCalled();

        setDocumentHidden(false);
        expect(connection.resume).toHaveBeenCalled();
    });

    it('keeps alert coins subscribed while the tab is hidden', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings.slice(0, 1));
        store.trackCoins(coinListings.slice(1, 2), 'alerts');

        expect(connection.setSymbols).toHaveBeenLastCalledWith(['BTCUSDT', 'LTCUSDT']);

        setDocumentHidden(true);
        expect(connection.setSymbols).toHaveBeenLastCalledWith(['LTCUSDT']);
        expect(connection.pause).not.toHaveBeenCalled();

        setDocumentHidden(false);
        expect(connection.setSymbols).toHaveBeenLastCalledWith(['BTCUSDT', 'LTCUSDT']);
    });

    it('keeps quotes of page coins while hidden so the table does not jump back', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings.slice(0, 1));
        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 64000, openPrice: 62000 });
        vi.advanceTimersByTime(1_000);

        setDocumentHidden(true);

        expect(store.quotes.bitcoin?.price).toBe(64000);
        setDocumentHidden(false);
    });

    it('does not replace quotes when nothing has to be dropped', () => {
        const store = useLiveTickerStore();
        store.trackCoins(coinListings);
        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 64000, openPrice: 62000 });
        vi.advanceTimersByTime(1_000);
        const quotesBefore = store.quotes;

        store.trackCoins(coinListings.slice(0, 2), 'alerts');

        expect(store.quotes).toBe(quotesBefore);
    });
});
