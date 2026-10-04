<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import MarketTable from '@/features/market-table/MarketTable.vue';
import { useMarketStore } from '@/stores/market';

const { t } = useI18n();
const marketStore = useMarketStore();
const { coins, watchlist, isLoading, loadError } = storeToRefs(marketStore);

const errorMessage = computed(() => {
    if (!loadError.value) {
        return '';
    }

    return t(`errors.${loadError.value.kind}`, { status: loadError.value.status });
});

onMounted(marketStore.loadTopCoins);
</script>

<template>
    <section class="market-overview">
        <p class="market-overview__summary">
            {{ t('marketOverview.summary', coins.length) }}
        </p>

        <p v-if="isLoading" class="market-overview__status">
            {{ t('marketOverview.loading') }}
        </p>

        <div v-else-if="loadError" class="market-overview__error" role="alert">
            <p>{{ errorMessage }}</p>
            <button type="button" class="market-overview__retry" @click="marketStore.loadTopCoins">
                {{ t('marketOverview.retry') }}
            </button>
        </div>

        <p v-else-if="coins.length === 0" class="market-overview__status">
            {{ t('marketOverview.empty') }}
        </p>

        <MarketTable
            v-else
            :coins="coins"
            :watchlist="watchlist"
            @toggle-watch="marketStore.toggleWatch"
        />
    </section>
</template>

<style lang="scss" scoped>
.market-overview {
    &__summary,
    &__status {
        padding-block: var(--space-3);
        font-family: var(--font-mono);
        font-size: var(--font-size-sm);
        color: var(--color-text-dim);
    }

    &__error {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
        align-items: center;
        padding-block: var(--space-3);
        font-size: var(--font-size-md);
    }

    &__retry {
        padding-block: var(--space-1);
        padding-inline: var(--space-3);
        background: transparent;
        border: 1px solid var(--color-amber-dim);
        border-radius: var(--radius);
        color: var(--color-amber);
        cursor: pointer;
    }
}
</style>
