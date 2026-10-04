<script setup lang="ts">
const SKELETON_ROWS = 10;
const SKELETON_COLUMNS = ['name', 'price', 'change', 'change', 'change', 'cap', 'cap', 'spark'];
</script>

<template>
    <div class="market-table-skeleton" aria-hidden="true">
        <div v-for="row in SKELETON_ROWS" :key="row" class="market-table-skeleton__row">
            <span class="market-table-skeleton__avatar" />
            <span
                v-for="(column, index) in SKELETON_COLUMNS"
                :key="index"
                class="market-table-skeleton__bar"
                :class="`market-table-skeleton__bar--${column}`"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.market-table-skeleton {
    border-block-start: 1px solid var(--color-border);

    &__row {
        display: flex;
        gap: var(--space-6);
        align-items: center;
        block-size: 3.5rem;
        padding-inline: var(--space-2);
        border-block-end: 1px solid var(--color-border);
    }

    &__avatar {
        flex: none;
        inline-size: 1.5rem;
        block-size: 1.5rem;
        background: var(--color-surface-hover);
        border-radius: var(--radius-full);
    }

    &__bar {
        display: none;
        block-size: 0.75rem;
        background: var(--color-surface-hover);
        border-radius: var(--radius-full);
        animation: market-table-skeleton-pulse 1.4s ease-in-out infinite;

        &--name {
            display: block;
            flex: 1 1 8rem;
        }

        &--price {
            display: block;
            flex: 0 1 5rem;
            margin-inline-start: auto;
        }

        &--change,
        &--cap,
        &--spark {
            flex: 0 1 4rem;

            @include from(md) {
                display: block;
            }
        }

        &--spark {
            flex-basis: 7rem;
            block-size: 1.5rem;
        }
    }
}

@keyframes market-table-skeleton-pulse {
    50% {
        opacity: 0.45;
    }
}
</style>
