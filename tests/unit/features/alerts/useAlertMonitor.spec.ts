import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createTickerConnection, type TickerConnectionHandlers } from '@/api/binanceSocket';
import { fetchCoinsByIds } from '@/api/coingecko';
import { useAlertMonitor } from '@/features/alerts/useAlertMonitor';
import { i18n } from '@/i18n';
import { useAlertsStore } from '@/stores/alerts';
import { useToastStore } from '@/stores/toasts';
import { showBrowserNotification } from '@/utils/browserNotifications';
import { bitcoinAlertCoin } from '../../../fixtures/alerts';
import { coinListings } from '../../../fixtures/coingecko';
import {
    createTickerConnectionMock,
    type TickerConnectionMock,
} from '../../../helpers/tickerConnectionMock';
import { withSetup } from '../../../helpers/withSetup';

vi.mock('@/api/binanceSocket', () => ({ createTickerConnection: vi.fn() }));
vi.mock('@/api/coingecko', () => ({ fetchCoinsByIds: vi.fn() }));
vi.mock('@/utils/browserNotifications', () => ({ showBrowserNotification: vi.fn() }));

let handlers: TickerConnectionHandlers;
let connection: TickerConnectionMock;

async function setupMonitor(createAlerts: (store: ReturnType<typeof useAlertsStore>) => void) {
    return withSetup(() => {
        createAlerts(useAlertsStore());
        useAlertMonitor();
    });
}

describe('useAlertMonitor', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        localStorage.clear();
        i18n.global.locale.value = 'en';
        connection = createTickerConnectionMock();
        vi.mocked(createTickerConnection).mockImplementation((connectionHandlers) => {
            handlers = connectionHandlers;

            return connection;
        });
        vi.mocked(fetchCoinsByIds).mockResolvedValue([]);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('subscribes to live prices of coins with active alerts', async () => {
        await setupMonitor((store) => store.createAlert(bitcoinAlertCoin, 90000, 85000));

        expect(connection.setSymbols).toHaveBeenLastCalledWith(['BTCUSDT']);
    });

    it('notifies through the browser and a toast when a live price reaches the target', async () => {
        await setupMonitor((store) => store.createAlert(bitcoinAlertCoin, 90000, 85000));

        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 90050, openPrice: 88000 });
        vi.advanceTimersByTime(1_000);
        await nextTick();

        expect(showBrowserNotification).toHaveBeenCalledWith(
            'BTC price alert',
            'Bitcoin rose above $90,000.00. Now $90,050.00.',
            'https://example.test/bitcoin.png',
        );
        expect(useToastStore().toasts[0]?.title).toBe('BTC price alert');
        expect(useAlertsStore().activeAlerts).toHaveLength(0);
    });

    it('polls CoinGecko once a minute and stops when no alerts are left', async () => {
        vi.mocked(fetchCoinsByIds)
            .mockResolvedValueOnce([{ ...coinListings[1]!, price: 66 }])
            .mockResolvedValueOnce([{ ...coinListings[1]!, price: 64.9 }]);
        await setupMonitor((store) =>
            store.createAlert(
                { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', imageUrl: '' },
                65,
                68.4,
            ),
        );
        await flushPromises();

        expect(fetchCoinsByIds).toHaveBeenCalledWith(['litecoin']);
        expect(useAlertsStore().activeAlerts).toHaveLength(1);

        vi.advanceTimersByTime(60_000);
        await flushPromises();

        expect(useAlertsStore().triggeredAlerts).toHaveLength(1);

        vi.advanceTimersByTime(180_000);
        expect(fetchCoinsByIds).toHaveBeenCalledTimes(2);
    });

    it('stays idle without active alerts', async () => {
        await setupMonitor(() => undefined);
        vi.advanceTimersByTime(120_000);

        expect(fetchCoinsByIds).not.toHaveBeenCalled();
    });

    it('ignores the lagging CoinGecko price for coins that have a live price', async () => {
        vi.mocked(fetchCoinsByIds)
            .mockResolvedValueOnce([{ ...coinListings[0]!, price: 90200 }])
            .mockResolvedValueOnce([{ ...coinListings[0]!, price: 89000 }]);
        await setupMonitor((store) => store.createAlert(bitcoinAlertCoin, 89500, 90000));
        await flushPromises();

        handlers.onUpdate({ symbol: 'BTCUSDT', lastPrice: 90010, openPrice: 88000 });
        vi.advanceTimersByTime(60_000);
        await flushPromises();

        expect(fetchCoinsByIds).toHaveBeenCalledTimes(2);
        expect(useAlertsStore().activeAlerts).toHaveLength(1);
    });
});
