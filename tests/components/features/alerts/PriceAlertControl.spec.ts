import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PriceAlertControl from '@/features/alerts/PriceAlertControl.vue';
import { useAlertsStore } from '@/stores/alerts';
import { bitcoinAlertCoin } from '../../../fixtures/alerts';
import { createTestPlugins } from '../../../helpers/plugins';

vi.mock('@/utils/browserNotifications', () => ({
    getNotificationAccess: vi.fn(() => 'default'),
    requestNotificationAccess: vi.fn(async () => 'default'),
}));

function mountControl() {
    const wrapper = mount(PriceAlertControl, {
        props: { coin: bitcoinAlertCoin, currentPrice: 85000, hasLivePrice: true },
        global: { plugins: createTestPlugins() },
        attachTo: document.body,
    });

    return { wrapper, store: useAlertsStore() };
}

describe('PriceAlertControl', () => {
    it('opens the panel and closes it with Escape', async () => {
        const { wrapper } = mountControl();
        const button = wrapper.find('.price-alert-control__button');

        await button.trigger('click');
        expect(button.attributes('aria-expanded')).toBe('true');
        expect(wrapper.find('[role="dialog"]').exists()).toBe(true);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await wrapper.vm.$nextTick();

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
        wrapper.unmount();
    });

    it('counts active alerts of the coin and lists them in the panel', async () => {
        const { wrapper, store } = mountControl();

        store.createAlert(bitcoinAlertCoin, 90000, 85000);
        await wrapper.find('.price-alert-control__button').trigger('click');

        expect(wrapper.find('.price-alert-control__button').text()).toBe('Alerts (1)');
        expect(wrapper.find('.price-alert-control__existing').text()).toContain('Above $90,000.00');
        wrapper.unmount();
    });
});
