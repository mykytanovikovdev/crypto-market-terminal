<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';
import { formatAmount } from '@/utils/format';

const props = defineProps<{
    symbol: string;
    price: number;
}>();

const COIN_FRACTION_DIGITS = 8;
const USD_FRACTION_DIGITS = 2;

type ConverterField = 'coin' | 'usd';

const { t } = useI18n();
const { numberLocale } = useLocale();

const editedField = ref<ConverterField>('coin');
const editedValue = ref<string>('1');

function parseAmount(value: string): number | null {
    const normalized = value.replace(/[\s,]/g, '');

    if (normalized === '') {
        return null;
    }

    const amount = Number(normalized);

    return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function convertEditedValue(targetField: ConverterField): string {
    const amount = parseAmount(editedValue.value);

    if (amount === null || props.price <= 0) {
        return '';
    }

    return targetField === 'usd'
        ? formatAmount(amount * props.price, numberLocale.value, USD_FRACTION_DIGITS)
        : formatAmount(amount / props.price, numberLocale.value, COIN_FRACTION_DIGITS);
}

function createFieldModel(field: ConverterField) {
    return computed<string>({
        get: () => (editedField.value === field ? editedValue.value : convertEditedValue(field)),
        set: (value) => {
            editedField.value = field;
            editedValue.value = value;
        },
    });
}

const coinAmount = createFieldModel('coin');
const usdAmount = createFieldModel('usd');
const upperSymbol = computed(() => props.symbol.toUpperCase());
</script>

<template>
    <section class="coin-converter">
        <h2 class="coin-converter__title">{{ t('converter.title') }}</h2>

        <label class="coin-converter__field">
            <span class="coin-converter__unit" aria-hidden="true">{{ upperSymbol }}</span>
            <span class="visually-hidden">{{
                t('converter.coinAmount', { symbol: upperSymbol })
            }}</span>
            <input
                v-model="coinAmount"
                class="coin-converter__input"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                dir="ltr"
            />
        </label>

        <label class="coin-converter__field">
            <span class="coin-converter__unit" aria-hidden="true">USD</span>
            <span class="visually-hidden">{{ t('converter.usdAmount') }}</span>
            <input
                v-model="usdAmount"
                class="coin-converter__input"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                dir="ltr"
            />
        </label>
    </section>
</template>

<style lang="scss" scoped>
.coin-converter {
    display: grid;
    gap: var(--space-2);
    padding-block-end: var(--space-4);

    &__title {
        padding-block: var(--space-4) var(--space-1);
        font-size: var(--font-size-lg);
    }

    &__field {
        display: flex;
        align-items: center;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);

        &:focus-within {
            border-color: var(--color-accent);
        }
    }

    &__unit {
        min-inline-size: 4rem;
        padding-inline: var(--space-3);
        color: var(--color-text-muted);
        font-weight: 600;
    }

    &__input {
        flex: 1;
        min-inline-size: 0;
        padding-block: var(--space-3);
        padding-inline: var(--space-3);
        background: transparent;
        border: 0;
        color: var(--color-text);
        font: inherit;
        font-size: var(--font-size-lg);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        text-align: end;

        &:focus-visible {
            outline: none;
        }
    }
}
</style>
