<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    isLoading: boolean;
    errorMessage: string | null;
    isEmpty: boolean;
}>();

const emit = defineEmits<{
    retry: [];
}>();

const { t } = useI18n();

function handleRetryClick(): void {
    emit('retry');
}
</script>

<template>
    <div v-if="isLoading" role="status">
        <slot name="loading">
            <div class="request-state">
                <span class="request-state__spinner" aria-hidden="true" />
                {{ t('requestState.loading') }}
            </div>
        </slot>
        <span v-if="$slots.loading" class="visually-hidden">{{ t('requestState.loading') }}</span>
    </div>

    <div v-else-if="errorMessage" class="request-state request-state--error" role="alert">
        <p>{{ errorMessage }}</p>
        <button type="button" class="request-state__retry" @click="handleRetryClick">
            {{ t('requestState.retry') }}
        </button>
    </div>

    <div v-else-if="isEmpty" class="request-state">
        <slot name="empty">
            <p>{{ t('requestState.empty') }}</p>
        </slot>
    </div>

    <slot v-else />
</template>

<style lang="scss" scoped>
.request-state {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: center;
    justify-content: center;
    min-block-size: 12rem;
    padding: var(--space-8) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    text-align: center;

    &--error {
        color: var(--color-text);
    }

    &__spinner {
        inline-size: 1.25rem;
        block-size: 1.25rem;
        border: 2px solid var(--color-border);
        border-block-start-color: var(--color-accent);
        border-radius: var(--radius-full);
        animation: request-state-spin 0.8s linear infinite;
    }

    &__retry {
        padding-block: var(--space-2);
        padding-inline: var(--space-4);
        background: var(--color-accent);
        border: 0;
        border-radius: var(--radius-sm);
        color: var(--color-on-accent);
        font-weight: 600;
        cursor: pointer;
    }
}

@keyframes request-state-spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
