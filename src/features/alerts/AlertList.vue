<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';
import type { PriceAlert } from '@/types/alert';
import { formatPrice, formatSignedPercent, formatTime } from '@/utils/format';
import { getDistancePercent } from '@/utils/priceAlerts';

defineProps<{
    alerts: PriceAlert[];
    currentPrices: Record<string, number>;
    showCoin: boolean;
}>();

const emit = defineEmits<{
    remove: [alertId: string];
    rearm: [alertId: string];
}>();

const { t } = useI18n();
const { numberLocale } = useLocale();

function describeCondition(alert: PriceAlert): string {
    return t(`alerts.condition.${alert.direction}`, {
        price: formatPrice(alert.targetPrice, numberLocale.value),
    });
}

function describeTrigger(alert: PriceAlert): string {
    return t('alerts.triggeredAt', {
        price: formatPrice(alert.triggeredPrice ?? alert.targetPrice, numberLocale.value),
        time: formatTime(new Date(alert.triggeredAt ?? 0), numberLocale.value),
    });
}

function describeDistance(alert: PriceAlert, prices: Record<string, number>): string | null {
    const currentPrice = prices[alert.coinId];

    if (currentPrice === undefined) {
        return null;
    }

    return t('alerts.fromCurrentPrice', {
        percent: formatSignedPercent(
            getDistancePercent(currentPrice, alert.targetPrice),
            numberLocale.value,
        ),
    });
}

function handleRemoveClick(alertId: string): void {
    emit('remove', alertId);
}

function handleRearmClick(alertId: string): void {
    emit('rearm', alertId);
}
</script>

<template>
    <ul class="alert-list" :class="{ 'alert-list--compact': !showCoin }">
        <li v-for="alert in alerts" :key="alert.id" class="alert-list__item">
            <RouterLink
                v-if="showCoin"
                class="alert-list__coin"
                :to="{ name: 'coin', params: { id: alert.coinId } }"
            >
                <img class="alert-list__logo" :src="alert.imageUrl" alt="" width="24" height="24" />
                <span class="alert-list__name">{{ alert.name }}</span>
                <span class="alert-list__symbol">{{ alert.symbol }}</span>
            </RouterLink>

            <span class="alert-list__condition">{{ describeCondition(alert) }}</span>

            <span v-if="alert.triggeredAt !== null" class="alert-list__status">
                {{ describeTrigger(alert) }}
            </span>
            <span v-else-if="describeDistance(alert, currentPrices)" class="alert-list__status">
                {{ describeDistance(alert, currentPrices) }}
            </span>

            <span class="alert-list__actions">
                <button
                    v-if="alert.triggeredAt !== null"
                    type="button"
                    class="alert-list__action"
                    @click="handleRearmClick(alert.id)"
                >
                    {{ t('alerts.rearm') }}
                </button>
                <button
                    type="button"
                    class="alert-list__action alert-list__action--quiet"
                    @click="handleRemoveClick(alert.id)"
                >
                    {{ t('alerts.remove') }}
                </button>
            </span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.alert-list {
    &--compact &__item {
        display: flex;
        flex-wrap: wrap;
    }

    &--compact &__actions {
        margin-inline-start: auto;
    }

    &__item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--space-1) var(--space-3);
        align-items: center;
        padding-block: var(--space-3);
        border-block-end: 1px solid var(--color-border);

        &:last-child {
            border-block-end: 0;
        }

        @include from(md) {
            grid-template-columns: minmax(10rem, 14rem) minmax(0, 1fr) minmax(0, 1fr) auto;
        }
    }

    &__coin {
        display: inline-flex;
        grid-column: 1 / -1;
        gap: var(--space-2);
        align-items: center;
        color: var(--color-text);
        font-weight: 600;
        text-decoration: none;

        &:hover .alert-list__name {
            color: var(--color-accent);
        }

        @include from(md) {
            grid-column: auto;
        }
    }

    &__logo {
        inline-size: 1.5rem;
        block-size: 1.5rem;
        border-radius: var(--radius-full);
    }

    &__symbol {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        font-weight: 500;
        text-transform: uppercase;
    }

    &__condition {
        font-weight: 600;
        unicode-bidi: isolate;
    }

    &__status {
        display: inline-flex;
        gap: var(--space-1);
        align-items: center;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }

    &__actions {
        display: flex;
        grid-column: 2;
        grid-row: 2;
        gap: var(--space-2);
        justify-content: flex-end;

        @include from(md) {
            grid-column: auto;
            grid-row: auto;
        }
    }

    &__action {
        padding-block: var(--space-1);
        padding-inline: var(--space-3);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;

        &:hover {
            border-color: var(--color-accent);
        }

        &--quiet {
            color: var(--color-text-muted);
        }
    }
}
</style>
