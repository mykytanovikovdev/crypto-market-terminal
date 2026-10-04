<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatPercent } from '@/utils/format';
import { getPriceDirection } from '@/utils/priceDirection';

const props = defineProps<{
    value: number | null;
    locale: string;
}>();

const { t } = useI18n();

const direction = computed(() => (props.value === null ? 'flat' : getPriceDirection(props.value)));
const formattedValue = computed(() =>
    props.value === null ? null : formatPercent(props.value, props.locale),
);
const directionLabel = computed(() => {
    if (direction.value === 'flat') {
        return null;
    }

    return direction.value === 'up' ? t('priceChange.up') : t('priceChange.down');
});
</script>

<template>
    <span v-if="formattedValue === null" class="percent-change">
        <span aria-hidden="true">—</span>
        <span class="visually-hidden">{{ t('priceChange.notAvailable') }}</span>
    </span>
    <span v-else class="percent-change" :class="`percent-change--${direction}`">
        <svg
            v-if="directionLabel"
            class="percent-change__caret"
            viewBox="0 0 10 6"
            role="img"
            :aria-label="directionLabel"
        >
            <path d="M5 0 10 6H0Z" />
        </svg>
        <span class="percent-change__value">{{ formattedValue }}</span>
    </span>
</template>

<style lang="scss" scoped>
.percent-change {
    display: inline-flex;
    gap: var(--space-1);
    align-items: center;
    justify-content: flex-end;
    color: var(--color-text-muted);
    font-weight: 500;

    &--up {
        color: var(--color-up);
    }

    &--down {
        color: var(--color-down);
    }

    &__caret {
        inline-size: 0.625rem;
        block-size: 0.375rem;
        fill: currentcolor;
    }

    &--down &__caret {
        transform: rotate(180deg);
    }

    &__value {
        unicode-bidi: isolate;
    }
}
</style>
