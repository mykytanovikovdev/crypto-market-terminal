<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AlertList from '@/features/alerts/AlertList.vue';
import PriceAlertForm from '@/features/alerts/PriceAlertForm.vue';
import { useAlertsStore } from '@/stores/alerts';
import type { AlertCoin } from '@/types/alert';

const props = defineProps<{
    coin: AlertCoin;
    currentPrice: number;
    hasLivePrice: boolean;
}>();

const { t } = useI18n();
const alertsStore = useAlertsStore();
const root = useTemplateRef<HTMLDivElement>('root');
const isOpen = ref<boolean>(false);
const formKey = ref<number>(0);

const coinAlerts = computed(() => alertsStore.getActiveAlertsForCoin(props.coin.id));
const currentPrices = computed(() => ({ [props.coin.id]: props.currentPrice }));
const buttonLabel = computed(() =>
    coinAlerts.value.length > 0
        ? t('alerts.buttonWithCount', { count: coinAlerts.value.length })
        : t('alerts.button'),
);

function closePanel(): void {
    isOpen.value = false;
}

function togglePanel(): void {
    isOpen.value = !isOpen.value;
}

function handleDocumentPointerDown(event: PointerEvent): void {
    if (root.value && !root.value.contains(event.target as Node)) {
        closePanel();
    }
}

function handleDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        closePanel();
    }
}

function listenForDismissal(open: boolean): void {
    if (open) {
        document.addEventListener('pointerdown', handleDocumentPointerDown);
        document.addEventListener('keydown', handleDocumentKeydown);
    } else {
        document.removeEventListener('pointerdown', handleDocumentPointerDown);
        document.removeEventListener('keydown', handleDocumentKeydown);
    }
}

function handleAlertCreated(): void {
    formKey.value += 1;
}

function removeDismissalListeners(): void {
    listenForDismissal(false);
}

watch(isOpen, listenForDismissal);
onBeforeUnmount(removeDismissalListeners);
</script>

<template>
    <div ref="root" class="price-alert-control">
        <button
            type="button"
            class="price-alert-control__button"
            :class="{ 'price-alert-control__button--active': coinAlerts.length > 0 }"
            aria-controls="price-alert-panel"
            :aria-expanded="isOpen"
            @click="togglePanel"
        >
            <svg class="price-alert-control__icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {{ buttonLabel }}
        </button>

        <div
            v-if="isOpen"
            id="price-alert-panel"
            class="price-alert-control__panel"
            role="dialog"
            :aria-label="t('alerts.panelLabel', { name: coin.name })"
        >
            <PriceAlertForm
                :key="formKey"
                :coin="coin"
                :current-price="currentPrice"
                :has-live-price="hasLivePrice"
                @created="handleAlertCreated"
            />

            <div v-if="coinAlerts.length > 0" class="price-alert-control__existing">
                <h3 class="price-alert-control__heading">{{ t('alerts.activeForCoin') }}</h3>
                <AlertList
                    :alerts="coinAlerts"
                    :current-prices="currentPrices"
                    :show-coin="false"
                    @remove="alertsStore.removeAlert"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

// On narrow screens the panel spans the whole coin header instead of hanging off the
// button, which may sit anywhere in the wrapped row (and on the left side in RTL).
.price-alert-control {
    @include from(sm) {
        position: relative;
    }

    &__button {
        display: inline-flex;
        gap: var(--space-2);
        align-items: center;
        padding-block: var(--space-2);
        padding-inline: var(--space-3);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font-size: var(--font-size-sm);
        font-weight: 600;
        cursor: pointer;

        &:hover {
            background: var(--color-surface-hover);
        }

        &--active {
            border-color: var(--color-accent);
        }
    }

    &__icon {
        inline-size: 1rem;
        block-size: 1rem;
        fill: none;
        stroke: var(--color-text-muted);
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    &__button--active &__icon {
        stroke: var(--color-accent);
    }

    &__panel {
        position: absolute;
        inset-block-start: calc(100% + var(--space-2));
        inset-inline: 0;
        z-index: 15;
        display: grid;
        gap: var(--space-4);

        @include from(sm) {
            inset-inline-start: auto;
            inline-size: 22rem;
        }

        padding: var(--space-4);
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: 0 12px 32px rgb(15 23 36 / 18%);
    }

    &__existing {
        padding-block-start: var(--space-3);
        border-block-start: 1px solid var(--color-border);
    }

    &__heading {
        font-size: var(--font-size-md);
    }
}
</style>
