<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import AlertList from '@/features/alerts/AlertList.vue';
import { useAlertsStore } from '@/stores/alerts';

const { t } = useI18n();
const alertsStore = useAlertsStore();
const { activeAlerts, triggeredAlerts, latestPrices } = storeToRefs(alertsStore);

function rearmAlert(alertId: string): void {
    const alert = alertsStore.alerts.find((item) => item.id === alertId);
    const currentPrice = alert ? (latestPrices.value[alert.coinId] ?? alert.referencePrice) : null;

    if (currentPrice !== null) {
        alertsStore.rearmAlert(alertId, currentPrice);
    }
}
</script>

<template>
    <section class="alerts-section">
        <h2 class="alerts-section__title">{{ t('alerts.sectionTitle') }}</h2>
        <p class="alerts-section__description">{{ t('alerts.sectionDescription') }}</p>

        <p
            v-if="activeAlerts.length === 0 && triggeredAlerts.length === 0"
            class="alerts-section__empty"
        >
            {{ t('alerts.empty') }}
        </p>

        <div v-if="activeAlerts.length > 0" class="alerts-section__group">
            <h3 class="alerts-section__group-title">{{ t('alerts.activeTitle') }}</h3>
            <AlertList
                :alerts="activeAlerts"
                :current-prices="latestPrices"
                show-coin
                @remove="alertsStore.removeAlert"
            />
        </div>

        <div v-if="triggeredAlerts.length > 0" class="alerts-section__group">
            <h3 class="alerts-section__group-title">{{ t('alerts.triggeredTitle') }}</h3>
            <AlertList
                :alerts="triggeredAlerts"
                :current-prices="latestPrices"
                show-coin
                @remove="alertsStore.removeAlert"
                @rearm="rearmAlert"
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.alerts-section {
    display: grid;
    gap: var(--space-3);
    margin-block-start: var(--space-12);

    &__title {
        font-size: var(--font-size-xl);
    }

    &__description,
    &__empty {
        max-inline-size: 40rem;
        color: var(--color-text-muted);
    }

    &__empty {
        padding: var(--space-6) var(--space-4);
        border: 1px dashed var(--color-border);
        border-radius: var(--radius-md);
        text-align: center;
        max-inline-size: none;
    }

    &__group {
        padding-block-start: var(--space-3);
    }

    &__group-title {
        padding-block-end: var(--space-1);
        border-block-end: 1px solid var(--color-border);
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }
}
</style>
