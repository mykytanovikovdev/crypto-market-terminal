<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from '@/components/PageHeader.vue';
import AlertsSection from '@/features/alerts/AlertsSection.vue';
import RequestState from '@/components/RequestState.vue';
import { useApiErrorMessage } from '@/composables/useApiErrorMessage';
import MarketTable from '@/features/market-table/MarketTable.vue';
import MarketTableSkeleton from '@/features/market-table/MarketTableSkeleton.vue';
import { useLiveCoins } from '@/composables/useLiveCoins';
import { useSortQuery } from '@/features/market-table/useSortQuery';
import { useMarketStore } from '@/stores/market';
import { sortCoins } from '@/utils/sortCoins';

const { t } = useI18n();
const marketStore = useMarketStore();
const { watchedCoins, watchlist, isWatchlistLoading, watchlistError } = storeToRefs(marketStore);
const errorMessage = useApiErrorMessage(watchlistError);
const { sort, toggleSort } = useSortQuery();

const liveCoins = useLiveCoins(watchedCoins);
const sortedCoins = computed(() => sortCoins(liveCoins.value, sort.value));

onMounted(marketStore.refreshWatchedCoins);
</script>

<template>
    <section class="watchlist-page">
        <PageHeader :title="t('watchlist.title')" :description="t('watchlist.description')" />

        <RequestState
            :is-loading="isWatchlistLoading"
            :error-message="errorMessage"
            :is-empty="sortedCoins.length === 0"
            @retry="marketStore.loadWatchedCoins"
        >
            <template #loading>
                <MarketTableSkeleton />
            </template>

            <template #empty>
                <h2 class="watchlist-page__empty-title">{{ t('watchlist.emptyTitle') }}</h2>
                <p>{{ t('watchlist.emptyText') }}</p>
                <RouterLink class="watchlist-page__empty-action" :to="{ name: 'markets' }">
                    {{ t('watchlist.emptyAction') }}
                </RouterLink>
            </template>

            <MarketTable
                :coins="sortedCoins"
                :watchlist="watchlist"
                :sort="sort"
                @toggle-watch="marketStore.toggleWatch"
                @sort="toggleSort"
            />
        </RequestState>

        <AlertsSection />
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
