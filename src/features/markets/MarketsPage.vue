<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { TOP_COINS_LIMIT } from '@/api/coingecko';
import PageHeader from '@/components/PageHeader.vue';
import RequestState from '@/components/RequestState.vue';
import { useApiErrorMessage } from '@/composables/useApiErrorMessage';
import { useLocale } from '@/composables/useLocale';
import MarketTable from '@/features/market-table/MarketTable.vue';
import { useMarketStore } from '@/stores/market';
import { formatTime } from '@/utils/format';

const { t } = useI18n();
const { numberLocale } = useLocale();
const marketStore = useMarketStore();
const { coins, watchlist, isLoading, loadError, lastUpdatedAt } = storeToRefs(marketStore);
const errorMessage = useApiErrorMessage(loadError);

const updatedAtLabel = computed(() => {
    if (!lastUpdatedAt.value) {
        return null;
    }

    return t('markets.updatedAt', { time: formatTime(lastUpdatedAt.value, numberLocale.value) });
});

onMounted(marketStore.loadTopCoins);
</script>

<template>
    <section class="markets-page">
        <PageHeader
            :title="t('markets.title')"
            :description="t('markets.description', { count: TOP_COINS_LIMIT })"
        >
            <template v-if="updatedAtLabel" #meta>{{ updatedAtLabel }}</template>
        </PageHeader>

        <RequestState
            :is-loading="isLoading"
            :error-message="errorMessage"
            :is-empty="coins.length === 0"
            @retry="marketStore.loadTopCoins"
        >
            <MarketTable
                :coins="coins"
                :watchlist="watchlist"
                @toggle-watch="marketStore.toggleWatch"
            />
        </RequestState>
    </section>
</template>
