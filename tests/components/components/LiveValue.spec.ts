import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LiveValue from '@/components/LiveValue.vue';

describe('LiveValue', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders the text without a flash initially', () => {
        const wrapper = mount(LiveValue, { props: { value: 100, text: '$100.00' } });

        expect(wrapper.text()).toBe('$100.00');
        expect(wrapper.classes()).toEqual(['live-value']);
    });

    it('flashes in the direction of the change and fades out', async () => {
        const wrapper = mount(LiveValue, { props: { value: 100, text: '$100.00' } });

        await wrapper.setProps({ value: 101, text: '$101.00' });
        expect(wrapper.classes()).toContain('live-value--up');

        await wrapper.setProps({ value: 99, text: '$99.00' });
        expect(wrapper.classes()).toContain('live-value--down');

        vi.advanceTimersByTime(900);
        await wrapper.vm.$nextTick();
        expect(wrapper.classes()).toEqual(['live-value']);
    });

    it('does not flash when the change is too small to be visible', async () => {
        const wrapper = mount(LiveValue, { props: { value: 0.99995, text: '$1.00' } });

        await wrapper.setProps({ value: 1.00002, text: '$1.00' });

        expect(wrapper.classes()).toEqual(['live-value']);
    });
});
