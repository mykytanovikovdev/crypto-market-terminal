<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from '@/components/PageHeader.vue';
import RequestState from '@/components/RequestState.vue';
import { useApiErrorMessage } from '@/composables/useApiErrorMessage';
import MarketTable from '@/features/market-table/MarketTable.vue';
import { useMarketStore } from '@/stores/market';

const { t } = useI18n();
const marketStore = useMarketStore();
const { watchedCoins, watchlist, isLoading, loadError } = storeToRefs(marketStore);
const errorMessage = useApiErrorMessage(loadError);

onMounted(marketStore.ensureCoinsLoaded);
</script>

<template>
    <section class="watchlist-page">
        <PageHeader :title="t('watchlist.title')" :description="t('watchlist.description')" />

        <RequestState
            :is-loading="isLoading"
            :error-message="errorMessage"
            :is-empty="watchedCoins.length === 0"
            @retry="marketStore.loadTopCoins"
        >
            <template #empty>
                <h2 class="watchlist-page__empty-title">{{ t('watchlist.emptyTitle') }}</h2>
                <p>{{ t('watchlist.emptyText') }}</p>
                <RouterLink class="watchlist-page__empty-action" :to="{ name: 'markets' }">
                    {{ t('watchlist.emptyAction') }}
                </RouterLink>
            </template>

            <MarketTable
                :coins="watchedCoins"
                :watchlist="watchlist"
                @toggle-watch="marketStore.toggleWatch"
            />
        </RequestState>
    </section>
</template>

<style lang="scss" scoped>
.watchlist-page {
    &__empty-title {
        color: var(--color-text);
        font-size: var(--font-size-lg);
    }

    &__empty-action {
        font-weight: 600;
    }
}
</style>
