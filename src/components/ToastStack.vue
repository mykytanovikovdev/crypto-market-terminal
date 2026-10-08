<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useToastStore } from '@/stores/toasts';

const { t } = useI18n();
const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
</script>

<template>
    <div class="toast-stack" role="status" aria-live="polite">
        <div v-for="toast in toasts" :key="toast.id" class="toast-stack__toast">
            <img
                v-if="toast.imageUrl"
                class="toast-stack__image"
                :src="toast.imageUrl"
                alt=""
                width="24"
                height="24"
            />
            <div class="toast-stack__content">
                <p class="toast-stack__title">{{ toast.title }}</p>
                <p class="toast-stack__body">{{ toast.body }}</p>
            </div>
            <button
                type="button"
                class="toast-stack__dismiss"
                :aria-label="t('toasts.dismiss')"
                @click="toastStore.dismissToast(toast.id)"
            >
                <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="m4 4 8 8M12 4l-8 8" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.toast-stack {
    position: fixed;
    inset-block-end: var(--space-4);
    inset-inline: var(--space-4);
    z-index: 30;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    pointer-events: none;

    @include from(sm) {
        inset-inline-start: auto;
        inline-size: 22rem;
    }

    &__toast {
        display: flex;
        gap: var(--space-3);
        align-items: flex-start;
        padding: var(--space-3) var(--space-4);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-inline-start: 3px solid var(--color-accent);
        border-radius: var(--radius-md);
        box-shadow: 0 8px 24px rgb(15 23 36 / 16%);
        pointer-events: auto;
    }

    &__image {
        flex: none;
        inline-size: 1.5rem;
        block-size: 1.5rem;
        border-radius: var(--radius-full);
    }

    &__content {
        flex: 1;
        min-inline-size: 0;
    }

    &__title {
        font-weight: 700;
    }

    &__body {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }

    &__dismiss {
        display: grid;
        place-items: center;
        inline-size: 1.75rem;
        block-size: 1.75rem;
        padding: 0;
        background: none;
        border: 0;
        border-radius: var(--radius-sm);
        color: var(--color-text-muted);
        cursor: pointer;

        &:hover {
            background: var(--color-surface-hover);
            color: var(--color-text);
        }

        svg {
            inline-size: 0.875rem;
            block-size: 0.875rem;
            stroke: currentcolor;
            stroke-width: 2;
            stroke-linecap: round;
        }
    }
}
</style>
