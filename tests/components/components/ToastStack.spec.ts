import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ToastStack from '@/components/ToastStack.vue';
import { useToastStore } from '@/stores/toasts';
import { createTestPlugins } from '../../helpers/plugins';

describe('ToastStack', () => {
    it('announces toasts politely and dismisses them', async () => {
        const wrapper = mount(ToastStack, { global: { plugins: createTestPlugins() } });
        const store = useToastStore();

        store.showToast({ title: 'BTC price alert', body: 'Bitcoin rose above $90,000.00.' });
        await wrapper.vm.$nextTick();

        expect(wrapper.attributes('aria-live')).toBe('polite');
        expect(wrapper.text()).toContain('BTC price alert');

        await wrapper.find('.toast-stack__dismiss').trigger('click');

        expect(wrapper.find('.toast-stack__toast').exists()).toBe(false);
    });
});
