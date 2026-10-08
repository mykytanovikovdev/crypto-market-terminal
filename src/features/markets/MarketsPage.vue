<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import PageHeader from '@/components/PageHeader.vue';
import RequestState from '@/components/RequestState.vue';
import { useApiErrorMessage } from '@/composables/useApiErrorMessage';
import { useLocale } from '@/composables/useLocale';
import MarketTable from '@/features/market-table/MarketTable.vue';
import MarketTableSkeleton from '@/features/market-table/MarketTableSkeleton.vue';
import { useLiveCoins } from '@/composables/useLiveCoins';
import { useSortQuery } from '@/features/market-table/useSortQuery';
import MarketToolbar from '@/features/markets/MarketToolbar.vue';
import { useMarketFiltersQuery } from '@/features/markets/useMarketFiltersQuery';
import { useMarketStore } from '@/stores/market';
import { filterCoins } from '@/utils/filterCoins';
import { formatTime } from '@/utils/format';
import { sortCoins } from '@/utils/sortCoins';

const { t } = useI18n();
const { numberLocale } = useLocale();
const marketStore = useMarketStore();
const { coins, watchlist, isLoading, loadError, lastUpdatedAt } = storeToRefs(marketStore);
const errorMessage = useApiErrorMessage(loadError);
const { sort, toggleSort } = useSortQuery();
const { searchQuery, movement, rowsLimit, hasActiveFilters, resetFilters } =
    useMarketFiltersQuery();

const filteredCoins = computed(() =>
    filterCoins(coins.value, { query: searchQuery.value, movement: movement.value }),
);
const liveCoins = useLiveCoins(filteredCoins);
const visibleCoins = computed(() => sortCoins(liveCoins.value, sort.value));

const updatedAtLabel = computed(() => {
    if (!lastUpdatedAt.value) {
        return null;
    }

    return t('markets.updatedAt', { time: formatTime(lastUpdatedAt.value, numberLocale.value) });
});

function reloadCoins(): void {
    void marketStore.loadTopCoins(rowsLimit.value);
}

watch(rowsLimit, marketStore.refreshTopCoins, { immediate: true });
</script>

<template>
    <section class="markets-page">
        <PageHeader
            :title="t('markets.title')"
            :description="t('markets.description', { count: rowsLimit })"
        >
            <template v-if="updatedAtLabel" #meta>{{ updatedAtLabel }}</template>
        </PageHeader>

        <MarketToolbar
            v-model:search-query="searchQuery"
            v-model:movement="movement"
            v-model:rows-limit="rowsLimit"
        />

        <RequestState
            :is-loading="isLoading"
            :error-message="errorMessage"
            :is-empty="coins.length === 0"
            @retry="reloadCoins"
        >
            <template #loading>
                <MarketTableSkeleton />
            </template>

            <MarketTable
                v-if="visibleCoins.length > 0"
                :coins="visibleCoins"
                :watchlist="watchlist"
                :sort="sort"
                @toggle-watch="marketStore.toggleWatch"
                @sort="toggleSort"
            />

            <div v-else class="markets-page__no-results" role="status">
                <p>{{ t('markets.noResults') }}</p>
                <button
                    v-if="hasActiveFilters"
                    type="button"
                    class="markets-page__reset"
                    @click="resetFilters"
                >
                    {{ t('markets.resetFilters') }}
                </button>
            </div>
        </RequestState>
    </section>
</template>

<style lang="scss" scoped>
.markets-page {
    &__no-results {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        align-items: center;
        padding: var(--space-12) var(--space-4);
        border-block: 1px solid var(--color-border);
        color: var(--color-text-muted);
        text-align: center;
    }

    &__reset {
        padding-block: var(--space-2);
        padding-inline: var(--space-4);
        background: transparent;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-accent);
        font-weight: 600;
        cursor: pointer;

        &:hover {
            background: var(--color-accent-soft);
        }
    }
}
</style>
