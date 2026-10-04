import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MarketTable from '@/features/market-table/MarketTable.vue';
import { coinListings } from '../../../fixtures/coingecko';
import { createTestPlugins } from '../../../helpers/plugins';

function mountMarketTable(watchlist: string[] = []) {
    return mount(MarketTable, {
        props: { coins: coinListings, watchlist },
        global: { plugins: createTestPlugins() },
    });
}

describe('MarketTable', () => {
    it('renders a row per coin with rank, name and formatted market data', () => {
        const wrapper = mountMarketTable();
        const rows = wrapper.findAll('tbody tr');
        const bitcoinRow = rows[0]?.text() ?? '';

        expect(rows).toHaveLength(coinListings.length);
        expect(bitcoinRow).toContain('1');
        expect(bitcoinRow).toContain('Bitcoin');
        expect(bitcoinRow).toContain('$64,250.12');
        expect(bitcoinRow).toContain('$1.27T');
        expect(bitcoinRow).toContain('19.7M');
    });

    it('shows the coin logo and keeps long names available as a tooltip', () => {
        const wrapper = mountMarketTable();

        expect(wrapper.find('.market-table__logo').attributes('src')).toBe(
            'https://example.test/bitcoin.png',
        );
        expect(wrapper.find('.market-table__name').attributes('title')).toBe('Bitcoin');
    });

    it('draws a labelled sparkline only when price history exists', () => {
        const wrapper = mountMarketTable();
        const sparklines = wrapper.findAll('.coin-sparkline');

        expect(sparklines).toHaveLength(2);
        expect(sparklines[0]?.attributes('aria-label')).toBe('Bitcoin price over the last 7 days');
    });

    it('reflects watchlist state on the watch button', () => {
        const wrapper = mountMarketTable(['litecoin']);
        const buttons = wrapper.findAll('.market-table__watch-button');

        expect(buttons[0]?.attributes('aria-pressed')).toBe('false');
        expect(buttons[1]?.attributes('aria-pressed')).toBe('true');
        expect(buttons[1]?.attributes('aria-label')).toBe('Remove Litecoin from watchlist');
    });

    it('emits toggleWatch with the coin id', async () => {
        const wrapper = mountMarketTable();

        await wrapper.findAll('.market-table__watch-button')[0]?.trigger('click');

        expect(wrapper.emitted('toggleWatch')).toEqual([['bitcoin']]);
    });
});
