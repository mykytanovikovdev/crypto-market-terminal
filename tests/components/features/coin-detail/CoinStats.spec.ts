import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CoinStats from '@/features/coin-detail/CoinStats.vue';
import { coinDetails } from '../../../fixtures/coinDetails';
import { createTestPlugins } from '../../../helpers/plugins';

function mountStats(overrides = {}) {
    return mount(CoinStats, {
        props: { coin: { ...coinDetails, ...overrides } },
        global: { plugins: createTestPlugins() },
    });
}

describe('CoinStats', () => {
    it('lists market cap, volume and fully diluted value', () => {
        const text = mountStats().text();

        expect(text).toContain('$1.7T');
        expect(text).toContain('$22B');
        expect(text).toContain('$1.79T');
    });

    it('places the price marker inside the 24h range', () => {
        const marker = mountStats().find('.coin-stats__bar-marker');

        expect(marker.attributes('style')).toContain('inset-inline-start: 50%');
    });

    it('shows progress towards the max supply, or says there is none', () => {
        expect(mountStats().text()).toContain('95.2% of max supply');
        expect(mountStats({ maxSupply: null }).text()).toContain('No max supply');
    });

    it('shows all-time high with its date and distance', () => {
        const text = mountStats().text();

        expect(text).toContain('$126,080.00');
        expect(text).toContain('Oct 6, 2025');
        expect(text).toContain('-32.2% from ATH');
    });

    it('hides the range when 24h high and low are unknown', () => {
        expect(mountStats({ high24h: null }).find('.coin-stats__bar-marker').exists()).toBe(false);
    });
});
