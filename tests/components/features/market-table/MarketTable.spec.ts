import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MarketTable from '@/features/market-table/MarketTable.vue';
import type { SortState } from '@/types/market';
import { coinListings } from '../../../fixtures/coingecko';
import { createTestPlugins, createTestRouter } from '../../../helpers/plugins';

function mountMarketTable(
    watchlist: string[] = [],
    sort: SortState = { key: 'rank', direction: 'asc' },
) {
    return mount(MarketTable, {
        props: { coins: coinListings, watchlist, sort },
        global: { plugins: createTestPlugins() },
    });
}

describe('MarketTable', () => {
    it('renders a row per coin with rank, name and formatted market data', () => {
        const wrapper = mountMarketTable();
        const rows = wrapper.findAll('tbody tr');
        const bitcoinRow = rows[0]?.text() ?? '';

        expect(rows).toHaveLength(coinListings.length);
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
        const sparklines = mountMarketTable().findAll('.coin-sparkline');

        expect(sparklines).toHaveLength(2);
        expect(sparklines[0]?.attributes('aria-label')).toBe('Bitcoin price over the last 7 days');
    });

    it('marks only the sorted column with aria-sort', () => {
        const wrapper = mountMarketTable([], { key: 'price', direction: 'desc' });
        const sortedHeadings = wrapper.findAll('th[aria-sort]');

        expect(sortedHeadings).toHaveLength(1);
        expect(sortedHeadings[0]?.text()).toContain('Price');
        expect(sortedHeadings[0]?.attributes('aria-sort')).toBe('descending');
    });

    it('emits the sort key when a column heading is clicked', async () => {
        const wrapper = mountMarketTable();
        const priceButton = wrapper
            .findAll('.market-table__sort-button')
            .find((button) => button.text().includes('Price'));

        await priceButton?.trigger('click');

        expect(wrapper.emitted('sort')).toEqual([['price']]);
    });

    it('reflects watchlist state on the watch button and emits toggleWatch', async () => {
        const wrapper = mountMarketTable(['litecoin']);
        const buttons = wrapper.findAll('.market-table__watch-button');

        expect(buttons[0]?.attributes('aria-pressed')).toBe('false');
        expect(buttons[1]?.attributes('aria-pressed')).toBe('true');
        expect(buttons[1]?.attributes('aria-label')).toBe('Remove Litecoin from watchlist');

        await buttons[0]?.trigger('click');

        expect(wrapper.emitted('toggleWatch')).toEqual([['bitcoin']]);
    });
});

describe('MarketTable navigation', () => {
    it('links the coin name to its page', () => {
        const link = mountMarketTable().find('.market-table__coin');

        expect(link.attributes('href')).toBe('/coin/bitcoin');
    });

    it('opens the coin page when a row is clicked, but not from the watch button', async () => {
        const router = createTestRouter();
        const wrapper = mount(MarketTable, {
            props: { coins: coinListings, watchlist: [], sort: { key: 'rank', direction: 'asc' } },
            global: { plugins: [...createTestPlugins().slice(0, 2), router] },
        });

        await wrapper.findAll('.market-table__watch-button')[1]?.trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.name).not.toBe('coin');

        await wrapper.findAll('tbody tr')[1]?.find('td:nth-child(4)').trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.fullPath).toBe('/coin/litecoin');
    });
});
