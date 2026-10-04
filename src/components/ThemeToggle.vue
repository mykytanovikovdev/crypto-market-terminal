<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTheme } from '@/composables/useTheme';

const { t } = useI18n();
const { currentTheme, toggleTheme } = useTheme();

const isDark = computed(() => currentTheme.value === 'dark');
const label = computed(() => (isDark.value ? t('theme.switchToLight') : t('theme.switchToDark')));
</script>

<template>
    <button
        type="button"
        class="theme-toggle"
        :aria-label="label"
        :title="label"
        @click="toggleTheme"
    >
        <svg v-if="isDark" class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path
                d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
        </svg>
        <svg v-else class="theme-toggle__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
    </button>
</template>

<style lang="scss" scoped>
.theme-toggle {
    display: grid;
    place-items: center;
    inline-size: 2.25rem;
    block-size: 2.25rem;
    padding: 0;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
        color var(--transition-fast),
        background-color var(--transition-fast);

    &:hover {
        background: var(--color-surface-hover);
        color: var(--color-text);
    }

    &__icon {
        inline-size: 1.125rem;
        block-size: 1.125rem;
        fill: none;
        stroke: currentcolor;
        stroke-width: 1.75;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
}
</style>
