import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CoinConverter from '@/features/coin-detail/CoinConverter.vue';
import { createTestPlugins } from '../../../helpers/plugins';

function mountConverter(price = 85000) {
    return mount(CoinConverter, {
        props: { symbol: 'btc', price },
        global: { plugins: createTestPlugins() },
    });
}

function inputs(wrapper: ReturnType<typeof mountConverter>) {
    const [coinInput, usdInput] = wrapper.findAll('input');

    return { coinInput: coinInput!, usdInput: usdInput! };
}

describe('CoinConverter', () => {
    it('starts with one coin converted to dollars', () => {
        const { coinInput, usdInput } = inputs(mountConverter());

        expect(coinInput.element.value).toBe('1');
        expect(usdInput.element.value).toBe('85,000');
    });

    it('converts in both directions', async () => {
        const wrapper = mountConverter();
        const { coinInput, usdInput } = inputs(wrapper);

        await coinInput.setValue('0.5');
        expect(usdInput.element.value).toBe('42,500');

        await usdInput.setValue('170,000');
        expect(coinInput.element.value).toBe('2');
    });

    it('recalculates the other side when the live price changes', async () => {
        const wrapper = mountConverter();

        await wrapper.setProps({ price: 90000 });

        expect(inputs(wrapper).usdInput.element.value).toBe('90,000');
    });

    it('clears the other side for input that is not a number', async () => {
        const wrapper = mountConverter();
        const { coinInput, usdInput } = inputs(wrapper);

        await coinInput.setValue('abc');

        expect(usdInput.element.value).toBe('');
    });
});
