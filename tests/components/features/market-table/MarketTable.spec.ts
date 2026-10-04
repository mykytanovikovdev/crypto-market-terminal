import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MarketTable from '@/features/market-table/MarketTable.vue';
import { coinListings } from '../../../fixtures/coingecko';
import { createTestI18n } from '../../../helpers/plugins';

function mountMarketTable(watchlist: string[] = []) {
    return mount(MarketTable, {
        props: { coins: coinListings, watchlist },
        global: { plugins: [createTestI18n()] },
    });
}

describe('MarketTable', () => {
    it('renders a row per coin with formatted values', () => {
        const wrapper = mountMarketTable();
        const rows = wrapper.findAll('tbody tr');

        expect(rows).toHaveLength(coinListings.length);
        expect(rows[0]?.text()).toContain('Bitcoin');
        expect(rows[0]?.text()).toContain('$64,250');
        expect(rows[0]?.text()).toContain('+2.35%');
    });

    it('marks price changes with a direction modifier', () => {
        const wrapper = mountMarketTable();
        const rows = wrapper.findAll('tbody tr');

        expect(rows[0]?.find('.market-table__cell--up').exists()).toBe(true);
        expect(rows[1]?.find('.market-table__cell--down').exists()).toBe(true);
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
