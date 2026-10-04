import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MarketToolbar from '@/features/markets/MarketToolbar.vue';
import { createTestPlugins } from '../../../helpers/plugins';

function mountToolbar() {
    return mount(MarketToolbar, {
        props: { searchQuery: '', movement: 'all', rowsLimit: 50 },
        global: { plugins: createTestPlugins() },
    });
}

describe('MarketToolbar', () => {
    it('emits the typed search query', async () => {
        const wrapper = mountToolbar();

        await wrapper.find('.market-toolbar__search-input').setValue('eth');

        expect(wrapper.emitted('update:searchQuery')).toEqual([['eth']]);
    });

    it('emits the selected movement filter and marks the active option', async () => {
        const wrapper = mountToolbar();
        const options = wrapper.findAll('.segmented-control__option');

        expect(options.map((option) => option.text())).toEqual(['All', 'Gainers', 'Losers']);
        expect(options[0]?.attributes('aria-pressed')).toBe('true');

        await options[2]?.trigger('click');

        expect(wrapper.emitted('update:movement')).toEqual([['losers']]);
    });

    it('emits the row limit as a number', async () => {
        const wrapper = mountToolbar();

        await wrapper.find('.market-toolbar__rows-select').setValue('100');

        expect(wrapper.emitted('update:rowsLimit')).toEqual([[100]]);
    });
});
