<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import LiveValue from '@/components/LiveValue.vue';
import PercentChange from '@/components/PercentChange.vue';
import { useLocale } from '@/composables/useLocale';
import type { CoinDetails } from '@/types/coin';
import { formatPrice } from '@/utils/format';

const props = defineProps<{
    coin: CoinDetails;
    isWatched: boolean;
}>();

const emit = defineEmits<{
    toggleWatch: [];
}>();

const { t } = useI18n();
const { numberLocale } = useLocale();

const formattedPrice = computed(() => formatPrice(props.coin.price, numberLocale.value));

function handleWatchClick(): void {
    emit('toggleWatch');
}
</script>

<template>
    <header class="coin-header">
        <div class="coin-header__identity">
            <img class="coin-header__logo" :src="coin.imageUrl" alt="" width="32" height="32" />
            <h1 class="coin-header__name">{{ coin.name }}</h1>
            <span class="coin-header__symbol">{{ coin.symbol }}</span>
            <span
                v-if="coin.rank"
                class="coin-header__rank"
                :title="t('coin.rank', { rank: coin.rank })"
            >
                #{{ coin.rank }}
            </span>

            <div class="coin-header__actions">
                <slot name="actions" />
                <button
                    type="button"
                    class="coin-header__watch"
                    :class="{ 'coin-header__watch--active': isWatched }"
                    :aria-pressed="isWatched"
                    @click="handleWatchClick"
                >
                    <svg class="coin-header__watch-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="m12 3 2.76 5.6 6.18.9-4.47 4.36 1.05 6.15L12 17.1l-5.52 2.9 1.05-6.15L3.06 9.5l6.18-.9L12 3Z"
                        />
                    </svg>
                    {{ isWatched ? t('coin.watching') : t('coin.watch') }}
                </button>
            </div>
        </div>

        <p class="coin-header__quote">
            <LiveValue class="coin-header__price" :value="coin.price" :text="formattedPrice" />
            <PercentChange
                class="coin-header__change"
                :value="coin.change24h"
                :locale="numberLocale"
            />
            <span class="coin-header__period">{{ t('coin.change24h') }}</span>
        </p>
    </header>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.coin-header {
    position: relative;
    display: grid;
    gap: var(--space-3);

    &__identity {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2) var(--space-3);
        align-items: center;
    }

    &__logo {
        inline-size: 2rem;
        block-size: 2rem;
        border-radius: var(--radius-full);
    }

    &__name {
        font-size: var(--font-size-xl);
    }

    &__symbol {
        color: var(--color-text-muted);
        font-weight: 600;
        text-transform: uppercase;
    }

    &__rank {
        padding-block: 0.125rem;
        padding-inline: var(--space-2);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
        font-weight: 600;
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-inline-start: auto;
    }

    &__watch {
        display: inline-flex;
        gap: var(--space-2);
        align-items: center;
        padding-block: var(--space-2);
        padding-inline: var(--space-3);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;

        &:hover {
            background: var(--color-surface-hover);
        }
    }

    &__watch-icon {
        inline-size: 1rem;
        block-size: 1rem;
        fill: none;
        stroke: var(--color-text-muted);
        stroke-width: 1.75;
        stroke-linejoin: round;
    }

    &__watch--active &__watch-icon {
        fill: var(--color-watch);
        stroke: var(--color-watch);
    }

    &__quote {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        align-items: baseline;
    }

    &__price {
        font-family: var(--font-heading);
        font-size: var(--font-size-2xl);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
        unicode-bidi: isolate;

        @include from(md) {
            font-size: 2.5rem;
        }
    }

    &__change {
        font-size: var(--font-size-lg);
        font-weight: 600;
    }

    &__period {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }
}
</style>
