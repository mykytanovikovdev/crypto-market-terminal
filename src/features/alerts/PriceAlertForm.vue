<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';
import { useAlertsStore } from '@/stores/alerts';
import type { AlertCoin } from '@/types/alert';
import {
    getNotificationAccess,
    requestNotificationAccess,
    type NotificationAccess,
} from '@/utils/browserNotifications';
import { formatPercent, formatPrice } from '@/utils/format';
import { getAlertDirection, getDistancePercent } from '@/utils/priceAlerts';

const props = defineProps<{
    coin: AlertCoin;
    currentPrice: number;
    hasLivePrice: boolean;
}>();

const emit = defineEmits<{
    created: [];
}>();

const MAX_INPUT_FRACTION_DIGITS = 8;

const { t } = useI18n();
const { numberLocale } = useLocale();
const alertsStore = useAlertsStore();

function toPlainNumber(value: number): string {
    return String(Number(value.toFixed(MAX_INPUT_FRACTION_DIGITS)));
}

const targetInput = ref<string>(toPlainNumber(props.currentPrice));
const isTargetEdited = ref<boolean>(false);
const notificationAccess = ref<NotificationAccess>(getNotificationAccess());

const targetPrice = computed(() => {
    const amount = Number(targetInput.value.replace(/[\s,]/g, ''));

    return targetInput.value.trim() !== '' && Number.isFinite(amount) && amount > 0 ? amount : null;
});

const direction = computed(() =>
    targetPrice.value === null ? null : getAlertDirection(props.currentPrice, targetPrice.value),
);

const hint = computed(() => {
    if (targetPrice.value === null) {
        return t('alerts.form.invalidPrice');
    }

    if (!direction.value) {
        return t('alerts.form.currentPriceHint', {
            price: formatPrice(props.currentPrice, numberLocale.value),
        });
    }

    return t(`alerts.form.hint.${direction.value}`, {
        percent: formatPercent(
            getDistancePercent(props.currentPrice, targetPrice.value),
            numberLocale.value,
        ),
    });
});

const isNotificationBlocked = computed(
    () => notificationAccess.value === 'denied' || notificationAccess.value === 'unsupported',
);

function followCurrentPrice(price: number): void {
    if (!isTargetEdited.value) {
        targetInput.value = toPlainNumber(price);
    }
}

function markTargetEdited(): void {
    isTargetEdited.value = true;
}

function updateNotificationAccess(access: NotificationAccess): void {
    notificationAccess.value = access;
}

function handleSubmit(): void {
    if (targetPrice.value === null || !direction.value) {
        return;
    }

    // Ask for permission from the submit click (browsers require a user gesture), but never
    // wait for the answer: an ignored prompt must not block creating the alert.
    void requestNotificationAccess().then(updateNotificationAccess);

    if (alertsStore.createAlert(props.coin, targetPrice.value, props.currentPrice)) {
        emit('created');
    }
}

watch(() => props.currentPrice, followCurrentPrice);
</script>

<template>
    <form class="price-alert-form" novalidate @submit.prevent="handleSubmit">
        <label class="price-alert-form__label" for="price-alert-target">
            {{ t('alerts.form.label') }}
        </label>
        <div class="price-alert-form__field">
            <span class="price-alert-form__unit" aria-hidden="true">USD</span>
            <input
                id="price-alert-target"
                v-model="targetInput"
                class="price-alert-form__input"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                dir="ltr"
                aria-describedby="price-alert-hint"
                :aria-invalid="targetPrice === null"
                @input="markTargetEdited"
            />
        </div>
        <p
            id="price-alert-hint"
            class="price-alert-form__hint"
            :class="{ 'price-alert-form__hint--error': targetPrice === null }"
        >
            {{ hint }}
        </p>
        <p v-if="!hasLivePrice" class="price-alert-form__note">
            {{ t('alerts.form.pollingNote') }}
        </p>
        <p v-if="isNotificationBlocked" class="price-alert-form__note">
            {{ t('alerts.form.notificationsBlocked') }}
        </p>
        <button type="submit" class="price-alert-form__submit" :disabled="!direction">
            {{ t('alerts.form.submit') }}
        </button>
    </form>
</template>

<style lang="scss" scoped>
.price-alert-form {
    display: grid;
    gap: var(--space-2);

    &__label {
        font-weight: 600;
    }

    &__field {
        display: flex;
        align-items: center;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);

        &:focus-within {
            border-color: var(--color-accent);
        }
    }

    &__unit {
        padding-inline: var(--space-3);
        color: var(--color-text-muted);
        font-weight: 600;
    }

    &__input {
        flex: 1;
        min-inline-size: 0;
        padding: var(--space-2) var(--space-3);
        background: transparent;
        border: 0;
        color: var(--color-text);
        font: inherit;
        font-size: var(--font-size-lg);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        text-align: end;

        &:focus-visible {
            outline: none;
        }
    }

    &__hint {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);

        &--error {
            color: var(--color-warning);
        }
    }

    &__note {
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
    }

    &__submit {
        padding-block: var(--space-2);
        background: var(--color-accent);
        border: 0;
        border-radius: var(--radius-sm);
        color: var(--color-on-accent);
        font-weight: 600;
        cursor: pointer;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
}
</style>
