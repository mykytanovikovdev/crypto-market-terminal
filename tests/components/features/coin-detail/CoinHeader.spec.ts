import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CoinHeader from '@/features/coin-detail/CoinHeader.vue';
import { coinDetails } from '../../../fixtures/coinDetails';
import { createTestPlugins } from '../../../helpers/plugins';

function mountHeader(isWatched = false) {
    return mount(CoinHeader, {
        props: { coin: coinDetails, isWatched },
        global: { plugins: createTestPlugins() },
    });
}

describe('CoinHeader', () => {
    it('shows name, ticker, rank and the formatted price', () => {
        const text = mountHeader().text();

        expect(text).toContain('Bitcoin');
        expect(text).toContain('btc');
        expect(text).toContain('#1');
        expect(text).toContain('$85,000.00');
    });

    it('switches the watch button label and emits toggleWatch', async () => {
        const unwatched = mountHeader(false);
        const watched = mountHeader(true);

        expect(unwatched.find('.coin-header__watch').text()).toBe('Watch');
        expect(watched.find('.coin-header__watch').text()).toBe('Watching');
        expect(watched.find('.coin-header__watch').attributes('aria-pressed')).toBe('true');

        await unwatched.find('.coin-header__watch').trigger('click');

        expect(unwatched.emitted('toggleWatch')).toHaveLength(1);
    });
});
