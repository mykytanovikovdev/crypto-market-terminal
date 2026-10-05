import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { createTickerConnection, type TickerConnectionHandlers } from '@/api/binanceSocket';
import { useLiveCoins } from '@/features/market-table/useLiveCoins';
import { coinListings } from '../../../fixtures/coingecko';
import { withSetup } from '../../../helpers/withSetup';

import {
    createTickerConnectionMock,
    type TickerConnectionMock,
} from '../../../helpers/tickerConnectionMock';

vi.mock('@/api/binanceSocket', () => ({ createTickerConnection: vi.fn() }));

let handlers: TickerConnectionHandlers;
let connection: TickerConnectionMock;

describe('useLiveCoins', () => {
    beforeEach(() => {
        connection = createTickerConnectionMock();
        vi.mocked(createTickerConnection).mockImplementation((connectionHandlers) => {
            handlers = connectionHandlers;

            return connection;
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('debounces subscription changes while the coin list is changing', async () => {
        vi.useFakeTimers();
        const coins = ref(coinListings);
        await withSetup(() => useLiveCoins(coins));

        coins.value = coinListings.slice(0, 1);
        await nextTick();
        vi.advanceTimersByTime(200);
        coins.value = coinListings.slice(1, 2);
        await nextTick();
        vi.advanceTimersByTime(400);

        expect(connection.setSymbols).toHaveBeenLastCalledWith(['LTCUSDT']);
    });

    it('returns coins with live price and 24h change applied', async () => {
        vi.useFakeTimers();
        const coins = ref(coinListings);
        const { result } = await withSetup(() => useLiveCoins(coins));

        vi.advanceTimersByTime(400);
        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 66000, openPrice: 60000 });
        vi.advanceTimersByTime(1_000);

        expect(result.value[0]).toMatchObject({ id: 'bitcoin', price: 66000, change24h: 10 });
        expect(result.value[1]).toEqual(coinListings[1]);
    });

    it('releases the subscription when the component unmounts', async () => {
        vi.useFakeTimers();
        const { unmount } = await withSetup(() => useLiveCoins(ref(coinListings)));

        vi.advanceTimersByTime(400);
        unmount();
        vi.advanceTimersByTime(3_000);

        expect(connection.setSymbols).toHaveBeenLastCalledWith([]);
    });
});
