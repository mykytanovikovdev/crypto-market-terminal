<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <div class="page-header">
        <h1 class="page-header__title">{{ title }}</h1>
        <p v-if="description" class="page-header__description">{{ description }}</p>
        <p v-if="$slots.meta" class="page-header__meta">
            <slot name="meta" />
        </p>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.page-header {
    display: grid;
    gap: var(--space-2);
    margin-block-end: var(--space-6);

    &__title {
        font-size: var(--font-size-xl);

        @include from(md) {
            font-size: var(--font-size-2xl);
        }
    }

    &__description {
        max-inline-size: 40rem;
        color: var(--color-text-muted);
        font-size: var(--font-size-md);
    }

    &__meta {
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
    }
}
</style>
