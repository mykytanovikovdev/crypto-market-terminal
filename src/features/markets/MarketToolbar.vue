<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { TOP_COINS_LIMIT_OPTIONS } from '@/api/coingecko';
import SegmentedControl, { type SegmentedOption } from '@/components/SegmentedControl.vue';
import type { MovementFilter } from '@/types/market';

const searchQuery = defineModel<string>('searchQuery', { required: true });
const movement = defineModel<MovementFilter>('movement', { required: true });
const rowsLimit = defineModel<number>('rowsLimit', { required: true });

const { t } = useI18n();

const movementOptions = computed<SegmentedOption<MovementFilter>[]>(() => [
    { value: 'all', label: t('marketToolbar.all') },
    { value: 'gainers', label: t('marketToolbar.gainers') },
    { value: 'losers', label: t('marketToolbar.losers') },
]);
</script>

<template>
    <div class="market-toolbar">
        <SegmentedControl
            v-model="movement"
            class="market-toolbar__movement"
            :options="movementOptions"
            :label="t('marketToolbar.movementLabel')"
        />

        <div class="market-toolbar__group">
            <label class="market-toolbar__search">
                <span class="visually-hidden">{{ t('marketToolbar.searchLabel') }}</span>
                <svg class="market-toolbar__search-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    v-model="searchQuery"
                    class="market-toolbar__search-input"
                    type="search"
                    autocomplete="off"
                    spellcheck="false"
                    :placeholder="t('marketToolbar.searchPlaceholder')"
                />
            </label>

            <label class="market-toolbar__rows">
                <span class="market-toolbar__rows-label">{{ t('marketToolbar.rowsLabel') }}</span>
                <select v-model.number="rowsLimit" class="market-toolbar__rows-select">
                    <option v-for="option in TOP_COINS_LIMIT_OPTIONS" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </label>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.market-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
    justify-content: space-between;
    margin-block-end: var(--space-4);

    &__group {
        display: flex;
        flex: 1 1 100%;
        gap: var(--space-3);
        align-items: center;

        @include from(md) {
            flex: 0 1 auto;
        }
    }

    &__search {
        position: relative;
        display: flex;
        flex: 1;
        align-items: center;

        @include from(md) {
            inline-size: 16rem;
        }
    }

    &__search-icon {
        position: absolute;
        inset-inline-start: var(--space-3);
        inline-size: 1rem;
        block-size: 1rem;
        fill: none;
        stroke: var(--color-text-muted);
        stroke-width: 2;
        stroke-linecap: round;
        pointer-events: none;
    }

    &__search-input {
        inline-size: 100%;
        padding-block: var(--space-2);
        padding-inline: calc(var(--space-3) * 2 + 1rem) var(--space-3);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font: inherit;

        &::placeholder {
            color: var(--color-text-muted);
        }

        &:focus-visible {
            outline-offset: 0;
        }
    }

    &__rows {
        display: inline-flex;
        gap: var(--space-2);
        align-items: center;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        white-space: nowrap;
    }

    &__rows-select {
        padding-block: var(--space-2);
        padding-inline: var(--space-2);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
    }
}
</style>
