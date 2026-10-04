<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables/useLocale';
import { getLocaleSettings, SUPPORTED_LOCALES, type AppLocale } from '@/i18n/locales';

const { t } = useI18n();
const { currentLocale, setLocale } = useLocale();

function isCurrent(locale: AppLocale): boolean {
    return currentLocale.value === locale;
}
</script>

<template>
    <div class="language-switch" role="group" :aria-label="t('language.label')">
        <button
            v-for="locale in SUPPORTED_LOCALES"
            :key="locale"
            type="button"
            class="language-switch__option"
            :class="{ 'language-switch__option--active': isCurrent(locale) }"
            :lang="locale"
            :aria-label="getLocaleSettings(locale).nativeName"
            :aria-pressed="isCurrent(locale)"
            @click="setLocale(locale)"
        >
            {{ getLocaleSettings(locale).shortLabel }}
        </button>
    </div>
</template>

<style lang="scss" scoped>
.language-switch {
    display: inline-flex;
    padding: 0.1875rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);

    &__option {
        min-inline-size: 2.25rem;
        padding-block: var(--space-1);
        padding-inline: var(--space-2);
        background: transparent;
        border: 0;
        border-radius: 0.25rem;
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
        font-weight: 600;
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
