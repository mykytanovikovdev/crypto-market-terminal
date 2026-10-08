import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AlertList from '@/features/alerts/AlertList.vue';
import { createAlert } from '../../../fixtures/alerts';
import { createTestPlugins } from '../../../helpers/plugins';

function mountList(alerts = [createAlert()], showCoin = true) {
    return mount(AlertList, {
        props: { alerts, currentPrices: { bitcoin: 81818.18 }, showCoin },
        global: { plugins: createTestPlugins() },
    });
}

describe('AlertList', () => {
    it('shows the condition and the distance from the current price as plain text', () => {
        const text = mountList().text();

        expect(text).toContain('Bitcoin');
        expect(text).toContain('Above $90,000.00');
        expect(text).toContain('+10% from the current price');
    });

    it('shows when a triggered alert fired and offers to turn it on again', async () => {
        const wrapper = mountList([
            createAlert({ triggeredAt: 1_790_000_000_000, triggeredPrice: 90123 }),
        ]);

        expect(wrapper.text()).toContain('Reached $90,123.00 at');

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Turn on again')
            ?.trigger('click');

        expect(wrapper.emitted('rearm')).toEqual([['alert-1']]);
    });

    it('emits remove and hides the coin column in the compact mode', async () => {
        const wrapper = mountList([createAlert()], false);

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Remove')
            ?.trigger('click');

        expect(wrapper.find('.alert-list__coin').exists()).toBe(false);
        expect(wrapper.classes()).toContain('alert-list--compact');
        expect(wrapper.emitted('remove')).toEqual([['alert-1']]);
    });
});
