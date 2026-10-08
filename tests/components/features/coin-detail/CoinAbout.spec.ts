import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CoinAbout from '@/features/coin-detail/CoinAbout.vue';
import { coinDetails } from '../../../fixtures/coinDetails';
import { createTestPlugins } from '../../../helpers/plugins';

describe('CoinAbout', () => {
    it('shows the first paragraph and expands to the full text', async () => {
        const wrapper = mount(CoinAbout, {
            props: { name: 'Bitcoin', paragraphs: coinDetails.descriptionParagraphs },
            global: { plugins: createTestPlugins() },
        });
        const toggle = wrapper.find('.coin-about__toggle');

        expect(wrapper.find('h2').text()).toBe('About Bitcoin');
        expect(wrapper.findAll('p')).toHaveLength(1);
        expect(toggle.attributes('aria-expanded')).toBe('false');

        await toggle.trigger('click');

        expect(wrapper.findAll('p')).toHaveLength(2);
        expect(toggle.text()).toBe('Show less');
    });

    it('is not rendered without a description', () => {
        const wrapper = mount(CoinAbout, {
            props: { name: 'Bitcoin', paragraphs: [] },
            global: { plugins: createTestPlugins() },
        });

        expect(wrapper.find('section').exists()).toBe(false);
    });
});
