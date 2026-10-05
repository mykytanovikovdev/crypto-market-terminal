<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLiveTickerStore } from '@/stores/liveTicker';

const { t } = useI18n();
const { status } = storeToRefs(useLiveTickerStore());

const label = computed(() => t(`liveStatus.${status.value}`));
const hint = computed(() => t(`liveStatus.${status.value}Hint`));
</script>

<template>
    <span
        v-if="status !== 'idle'"
        class="live-status"
        :class="`live-status--${status}`"
        role="status"
        :title="hint"
    >
        <span class="live-status__dot" aria-hidden="true" />
        <span class="live-status__label">{{ label }}</span>
        <span class="visually-hidden">{{ hint }}</span>
    </span>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.live-status {
    display: inline-flex;
    gap: var(--space-2);
    align-items: center;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: 600;
    white-space: nowrap;

    &__dot {
        inline-size: 0.5rem;
        block-size: 0.5rem;
        background: var(--color-icon-subtle);
        border-radius: var(--radius-full);
    }

    &__label {
        display: none;

        @include from(sm) {
            display: inline;
        }
    }

    &--live &__dot {
        background: var(--color-accent);
        box-shadow: 0 0 0 3px var(--color-accent-soft);
    }

    &--connecting &__dot,
    &--reconnecting &__dot {
        background: var(--color-warning);
    }
}
</style>
