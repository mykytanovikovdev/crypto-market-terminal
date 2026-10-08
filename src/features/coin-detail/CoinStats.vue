<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';
import type { CoinDetails } from '@/types/coin';
import {
    formatCompactCurrency,
    formatCompactNumber,
    formatDate,
    formatPrice,
    formatSignedPercent,
} from '@/utils/format';

const props = defineProps<{
    coin: CoinDetails;
}>();

const { t } = useI18n();
const { numberLocale } = useLocale();

function clampPercent(value: number): number {
    return Math.min(Math.max(value, 0), 100);
}

const range24h = computed(() => {
    const { low24h, high24h, price } = props.coin;

    if (low24h === null || high24h === null || high24h <= low24h) {
        return null;
    }

    return {
        low: formatPrice(low24h, numberLocale.value),
        high: formatPrice(high24h, numberLocale.value),
        position: clampPercent(((price - low24h) / (high24h - low24h)) * 100),
    };
});

const supplyShare = computed(() => {
    const { circulatingSupply, maxSupply } = props.coin;

    return maxSupply ? clampPercent((circulatingSupply / maxSupply) * 100) : null;
});

function formatSupplyShare(share: number): string {
    return new Intl.NumberFormat(numberLocale.value, {
        style: 'percent',
        maximumFractionDigits: 1,
    }).format(share / 100);
}
</script>

<template>
    <section class="coin-stats">
        <h2 class="coin-stats__title">{{ t('coinStats.title') }}</h2>

        <dl class="coin-stats__list">
            <div class="coin-stats__row">
                <dt>{{ t('coinStats.marketCap') }}</dt>
                <dd>{{ formatCompactCurrency(coin.marketCap, numberLocale) }}</dd>
            </div>
            <div class="coin-stats__row">
                <dt>{{ t('coinStats.volume24h') }}</dt>
                <dd>{{ formatCompactCurrency(coin.volume24h, numberLocale) }}</dd>
            </div>
            <div v-if="coin.fullyDilutedValuation !== null" class="coin-stats__row">
                <dt>{{ t('coinStats.fullyDilutedValuation') }}</dt>
                <dd>{{ formatCompactCurrency(coin.fullyDilutedValuation, numberLocale) }}</dd>
            </div>

            <div v-if="range24h" class="coin-stats__row coin-stats__row--stacked">
                <dt>{{ t('coinStats.range24h') }}</dt>
                <dd>
                    <span class="coin-stats__range-labels">
                        <span
                            >{{ t('coinStats.low') }} <b>{{ range24h.low }}</b></span
                        >
                        <span
                            >{{ t('coinStats.high') }} <b>{{ range24h.high }}</b></span
                        >
                    </span>
                    <span class="coin-stats__bar" aria-hidden="true">
                        <span
                            class="coin-stats__bar-fill"
                            :style="{ inlineSize: `${range24h.position}%` }"
                        />
                        <span
                            class="coin-stats__bar-marker"
                            :style="{ insetInlineStart: `${range24h.position}%` }"
                        />
                    </span>
                    <span class="visually-hidden">
                        {{
                            t('coinStats.rangeSummary', {
                                price: formatPrice(coin.price, numberLocale),
                                low: range24h.low,
                                high: range24h.high,
                            })
                        }}
                    </span>
                </dd>
            </div>

            <div class="coin-stats__row coin-stats__row--stacked">
                <dt>{{ t('coinStats.circulatingSupply') }}</dt>
                <dd>
                    <span class="coin-stats__value">
                        {{ formatCompactNumber(coin.circulatingSupply, numberLocale) }}
                        {{ coin.symbol.toUpperCase() }}
                    </span>
                    <template v-if="supplyShare !== null && coin.maxSupply">
                        <span class="coin-stats__bar" aria-hidden="true">
                            <span
                                class="coin-stats__bar-fill coin-stats__bar-fill--accent"
                                :style="{ inlineSize: `${supplyShare}%` }"
                            />
                        </span>
                        <span class="coin-stats__caption">
                            <span>
                                {{
                                    t('coinStats.ofMaxSupply', {
                                        percent: formatSupplyShare(supplyShare),
                                    })
                                }}
                            </span>
                            <span>
                                {{
                                    t('coinStats.maxSupply', {
                                        amount: formatCompactNumber(coin.maxSupply, numberLocale),
                                    })
                                }}
                            </span>
                        </span>
                    </template>
                    <span v-else class="coin-stats__caption">{{ t('coinStats.noMaxSupply') }}</span>
                </dd>
            </div>

            <div v-if="coin.allTimeHigh" class="coin-stats__row">
                <dt>{{ t('coinStats.allTimeHigh') }}</dt>
                <dd>
                    <span class="coin-stats__value">
                        {{ formatPrice(coin.allTimeHigh.price, numberLocale) }}
                    </span>
                    <span class="coin-stats__detail">
                        {{ formatDate(coin.allTimeHigh.date, numberLocale) }}
                    </span>
                    <span class="coin-stats__detail">
                        {{
                            t('coinStats.fromAllTimeHigh', {
                                percent: formatSignedPercent(
                                    coin.allTimeHigh.changePercent,
                                    numberLocale,
                                ),
                            })
                        }}
                    </span>
                </dd>
            </div>

            <div v-if="coin.allTimeLow" class="coin-stats__row">
                <dt>{{ t('coinStats.allTimeLow') }}</dt>
                <dd>
                    <span class="coin-stats__value">
                        {{ formatPrice(coin.allTimeLow.price, numberLocale) }}
                    </span>
                    <span class="coin-stats__detail">
                        {{ formatDate(coin.allTimeLow.date, numberLocale) }}
                    </span>
                </dd>
            </div>
        </dl>
    </section>
</template>

<style lang="scss" scoped>
.coin-stats {
    &__title {
        padding-block: var(--space-4) var(--space-1);
        font-size: var(--font-size-lg);
    }

    &__list {
        margin: 0;
    }

    &__row {
        display: flex;
        gap: var(--space-3);
        justify-content: space-between;
        padding-block: var(--space-3);
        border-block-end: 1px solid var(--color-border);

        &:last-child {
            border-block-end: 0;
        }

        dt {
            color: var(--color-text-muted);
        }

        dd {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin: 0;
            font-weight: 600;
            text-align: end;
            unicode-bidi: isolate;
        }

        &--stacked {
            flex-direction: column;
            gap: var(--space-2);

            dd {
                align-items: stretch;
                gap: var(--space-1);
                text-align: start;
            }
        }
    }

    &__row--stacked &__value {
        align-self: flex-end;
    }

    &__range-labels,
    &__caption {
        display: flex;
        justify-content: space-between;
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
        font-weight: 500;

        b {
            color: var(--color-text);
            font-weight: 600;
        }
    }

    &__bar {
        position: relative;
        display: block;
        block-size: 0.25rem;
        background: var(--color-surface-hover);
        border-radius: var(--radius-full);
    }

    &__bar-fill {
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        background: var(--color-icon-subtle);
        border-radius: var(--radius-full);

        &--accent {
            background: var(--color-accent);
        }
    }

    &__bar-marker {
        position: absolute;
        inset-block-start: 50%;
        inline-size: 0.625rem;
        block-size: 0.625rem;
        background: var(--color-text);
        border: 2px solid var(--color-bg);
        border-radius: var(--radius-full);
        transform: translate(-50%, -50%);

        [dir='rtl'] & {
            transform: translate(50%, -50%);
        }
    }

    &__detail {
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
        font-weight: 500;
    }
}
</style>
