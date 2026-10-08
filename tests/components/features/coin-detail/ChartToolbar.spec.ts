import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ChartToolbar from '@/features/coin-detail/ChartToolbar.vue';
import { createTestPlugins } from '../../../helpers/plugins';

function mountToolbar() {
    return mount(ChartToolbar, {
        props: { timeframe: '7D', chartType: 'candles', showSma: true, showRsi: true },
        global: { plugins: createTestPlugins() },
    });
}

describe('ChartToolbar', () => {
    it('emits the selected period and chart type', async () => {
        const wrapper = mountToolbar();
        const options = wrapper.findAll('.segmented-control__option');

        await options.find((option) => option.text() === '1Y')?.trigger('click');
        await options.find((option) => option.text() === 'Line')?.trigger('click');

        expect(wrapper.emitted('update:timeframe')).toEqual([['1Y']]);
        expect(wrapper.emitted('update:chartType')).toEqual([['line']]);
    });

    it('toggles indicators and reflects their state', async () => {
        const wrapper = mountToolbar();
        const [smaToggle, rsiToggle] = wrapper.findAll('.chart-toolbar__toggle');

        expect(smaToggle?.attributes('aria-pressed')).toBe('true');

        await rsiToggle?.trigger('click');

        expect(wrapper.emitted('update:showRsi')).toEqual([[false]]);
    });
});
