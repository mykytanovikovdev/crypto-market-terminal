<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import PercentChange from '@/components/PercentChange.vue';
import { useLocale } from '@/composables/useLocale';
import type { CoinDetails } from '@/types/coin';

const props = defineProps<{
    coin: CoinDetails;
}>();

const { t } = useI18n();
const { numberLocale } = useLocale();

const periods = computed(() => [
    { key: 'change1h', value: props.coin.change1h },
    { key: 'change24h', value: props.coin.change24h },
    { key: 'change7d', value: props.coin.change7d },
    { key: 'change30d', value: props.coin.change30d },
    { key: 'change1y', value: props.coin.change1y },
]);
</script>

<template>
    <section class="coin-performance">
        <h2 class="coin-performance__title">{{ t('performance.title') }}</h2>
        <dl class="coin-performance__grid">
            <div v-for="period in periods" :key="period.key" class="coin-performance__cell">
                <dt class="coin-performance__label">{{ t(`performance.${period.key}`) }}</dt>
                <dd class="coin-performance__value">
                    <PercentChange :value="period.value" :locale="numberLocale" />
                </dd>
            </div>
        </dl>
    </section>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.coin-performance {
    &__title {
        margin-block-end: var(--space-3);
        font-size: var(--font-size-lg);
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        margin: 0;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
    }

    &__cell {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        align-items: center;
        padding-block: var(--space-3);
        padding-inline: var(--space-1);
        border-inline-end: 1px solid var(--color-border);

        &:last-child {
            border-inline-end: 0;
        }
    }

    &__label {
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
        font-weight: 600;
    }

    &__value {
        margin: 0;
        font-size: var(--font-size-xs);

        @include from(sm) {
            font-size: var(--font-size-md);
        }
    }
}
</style>
