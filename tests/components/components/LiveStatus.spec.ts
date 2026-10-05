import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import LiveStatus from '@/components/LiveStatus.vue';
import { useLiveTickerStore } from '@/stores/liveTicker';
import { createTestPlugins } from '../../helpers/plugins';

function mountLiveStatus() {
    const wrapper = mount(LiveStatus, { global: { plugins: createTestPlugins() } });

    return { wrapper, store: useLiveTickerStore() };
}

describe('LiveStatus', () => {
    it('stays hidden while no page uses live prices', () => {
        const { wrapper } = mountLiveStatus();

        expect(wrapper.find('.live-status').exists()).toBe(false);
    });

    it('shows the connection state with an explanation', async () => {
        const { wrapper, store } = mountLiveStatus();

        store.status = 'live';
        await wrapper.vm.$nextTick();

        expect(wrapper.classes()).toContain('live-status--live');
        expect(wrapper.find('.live-status__label').text()).toBe('Live');
        expect(wrapper.attributes('title')).toBe('Prices update in real time from Binance.');
    });

    it('tells the user when live prices are unavailable', async () => {
        const { wrapper, store } = mountLiveStatus();

        store.status = 'unavailable';
        await wrapper.vm.$nextTick();

        expect(wrapper.find('.live-status__label').text()).toBe('Offline');
        expect(wrapper.text()).toContain('Showing CoinGecko data');
    });
});
