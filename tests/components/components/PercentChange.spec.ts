import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PercentChange from '@/components/PercentChange.vue';
import { createTestPlugins } from '../../helpers/plugins';

function mountPercentChange(value: number | null) {
    return mount(PercentChange, {
        props: { value, locale: 'en-US' },
        global: { plugins: createTestPlugins() },
    });
}

describe('PercentChange', () => {
    it('marks growth with an up caret and modifier', () => {
        const wrapper = mountPercentChange(2.345);

        expect(wrapper.classes()).toContain('percent-change--up');
        expect(wrapper.find('.percent-change__caret').attributes('aria-label')).toBe('Up');
        expect(wrapper.text()).toBe('2.35%');
    });

    it('marks a decline with a down caret and modifier', () => {
        const wrapper = mountPercentChange(-1.2);

        expect(wrapper.classes()).toContain('percent-change--down');
        expect(wrapper.find('.percent-change__caret').attributes('aria-label')).toBe('Down');
    });

    it('shows a change that rounds to zero as neutral without a caret', () => {
        const wrapper = mountPercentChange(-0.002);

        expect(wrapper.classes()).toContain('percent-change--flat');
        expect(wrapper.find('.percent-change__caret').exists()).toBe(false);
        expect(wrapper.text()).toBe('0.00%');
    });

    it('shows a dash with an accessible label when the value is missing', () => {
        const wrapper = mountPercentChange(null);

        expect(wrapper.text()).toContain('—');
        expect(wrapper.find('.visually-hidden').text()).toBe('Not available');
    });
});
