import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PriceAlertForm from '@/features/alerts/PriceAlertForm.vue';
import { useAlertsStore } from '@/stores/alerts';
import { bitcoinAlertCoin } from '../../../fixtures/alerts';
import { createTestPlugins } from '../../../helpers/plugins';

vi.mock('@/utils/browserNotifications', () => ({
    getNotificationAccess: vi.fn(() => 'default'),
    requestNotificationAccess: vi.fn(() => new Promise(() => undefined)),
}));

function mountForm(hasLivePrice = true) {
    const wrapper = mount(PriceAlertForm, {
        props: { coin: bitcoinAlertCoin, currentPrice: 85000, hasLivePrice },
        global: { plugins: createTestPlugins() },
    });

    return { wrapper, store: useAlertsStore() };
}

describe('PriceAlertForm', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('starts at the current price with a neutral hint and a disabled button', () => {
        const { wrapper } = mountForm();

        expect(wrapper.find('input').element.value).toBe('85000');
        expect(wrapper.find('.price-alert-form__hint').text()).toBe(
            'The current price is $85,000.00. Enter a higher or lower price.',
        );
        expect(wrapper.find('.price-alert-form__hint--error').exists()).toBe(false);
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    });

    it('describes how far the target is from the current price', async () => {
        const { wrapper } = mountForm();

        await wrapper.find('input').setValue('93500');
        expect(wrapper.find('.price-alert-form__hint').text()).toBe(
            '10.00% above the current price',
        );

        await wrapper.find('input').setValue('76,500');
        expect(wrapper.find('.price-alert-form__hint').text()).toBe(
            '10.00% below the current price',
        );
    });

    it('flags input that is not a positive number', async () => {
        const { wrapper } = mountForm();

        await wrapper.find('input').setValue('abc');

        expect(wrapper.find('.price-alert-form__hint--error').text()).toBe(
            'Enter a price greater than zero.',
        );
    });

    it('creates the alert without waiting for the notification prompt', async () => {
        const { wrapper, store } = mountForm();

        await wrapper.find('input').setValue('90000');
        await wrapper.find('form').trigger('submit');

        expect(store.activeAlerts[0]).toMatchObject({ targetPrice: 90000, direction: 'above' });
        expect(wrapper.emitted('created')).toHaveLength(1);
    });

    it('explains the once-a-minute check for coins without live prices', () => {
        const { wrapper } = mountForm(false);

        expect(wrapper.text()).toContain('checked once a minute');
    });

    it('follows the live price until the user edits the target', async () => {
        const { wrapper } = mountForm();

        await wrapper.setProps({ currentPrice: 85100 });
        expect(wrapper.find('input').element.value).toBe('85100');
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();

        await wrapper.find('input').setValue('90000');
        await wrapper.setProps({ currentPrice: 85200 });
        expect(wrapper.find('input').element.value).toBe('90000');
    });
});
