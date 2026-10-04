<script setup lang="ts" generic="TValue extends string">
export interface SegmentedOption<TOptionValue extends string> {
    value: TOptionValue;
    label: string;
    ariaLabel?: string;
    lang?: string;
}

defineProps<{
    options: SegmentedOption<TValue>[];
    label: string;
}>();

const model = defineModel<TValue>({ required: true });

function selectOption(value: TValue): void {
    model.value = value;
}
</script>

<template>
    <div class="segmented-control" role="group" :aria-label="label">
        <button
            v-for="option in options"
            :key="option.value"
            type="button"
            class="segmented-control__option"
            :class="{ 'segmented-control__option--active': option.value === model }"
            :lang="option.lang"
            :aria-label="option.ariaLabel"
            :aria-pressed="option.value === model"
            @click="selectOption(option.value)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<style lang="scss" scoped>
.segmented-control {
    display: inline-flex;
    padding: 0.1875rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);

    &__option {
        min-inline-size: 2.25rem;
        padding-block: var(--space-1);
        padding-inline: var(--space-3);
        background: transparent;
        border: 0;
        border-radius: 0.25rem;
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        transition:
            color var(--transition-fast),
            background-color var(--transition-fast);

        &:hover {
            color: var(--color-text);
        }

        &--active {
            background: var(--color-bg);
            color: var(--color-text);
            box-shadow: 0 1px 2px rgb(15 23 36 / 12%);
        }
    }
}
</style>
