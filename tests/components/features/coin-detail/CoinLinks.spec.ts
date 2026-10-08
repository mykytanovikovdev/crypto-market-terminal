import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CoinLinks from '@/features/coin-detail/CoinLinks.vue';
import { coinDetails } from '../../../fixtures/coinDetails';
import { createTestPlugins } from '../../../helpers/plugins';

describe('CoinLinks', () => {
    it('opens every link in a new tab without exposing the opener', () => {
        const links = mount(CoinLinks, {
            props: { links: coinDetails.links },
            global: { plugins: createTestPlugins() },
        }).findAll('a');

        expect(links.map((link) => link.text())).toEqual([
            'Website',
            'Whitepaper',
            'GitHub',
            'Reddit',
        ]);
        expect(links.every((link) => link.attributes('rel') === 'noopener noreferrer')).toBe(true);
    });
});
