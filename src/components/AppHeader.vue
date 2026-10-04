<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppLogo from '@/components/AppLogo.vue';
import LanguageSwitch from '@/components/LanguageSwitch.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';

const NAV_LINKS = [
    { routeName: 'markets', labelKey: 'nav.markets' },
    { routeName: 'watchlist', labelKey: 'nav.watchlist' },
    { routeName: 'about', labelKey: 'nav.about' },
] as const;

const { t } = useI18n();
</script>

<template>
    <header class="app-header">
        <div class="app-header__inner">
            <RouterLink class="app-header__brand" :to="{ name: 'markets' }">
                <AppLogo />
                <span class="app-header__brand-name">Market Terminal</span>
            </RouterLink>

            <nav class="app-header__nav" :aria-label="t('nav.label')">
                <RouterLink
                    v-for="link in NAV_LINKS"
                    :key="link.routeName"
                    class="app-header__nav-link"
                    active-class="app-header__nav-link--active"
                    exact-active-class="app-header__nav-link--active"
                    :to="{ name: link.routeName }"
                >
                    {{ t(link.labelKey) }}
                </RouterLink>
            </nav>

            <div class="app-header__controls">
                <LanguageSwitch />
                <ThemeToggle />
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.app-header {
    position: sticky;
    inset-block-start: 0;
    z-index: 10;
    background: var(--color-bg);
    border-block-end: 1px solid var(--color-border);

    &__inner {
        display: grid;
        grid-template-areas:
            'brand controls'
            'nav nav';
        grid-template-columns: 1fr auto;
        column-gap: var(--space-6);
        align-items: center;
        max-inline-size: var(--layout-max-width);
        margin-inline: auto;
        padding-inline: var(--space-4);

        @include from(md) {
            grid-template-areas: 'brand nav controls';
            grid-template-columns: auto 1fr auto;
            min-block-size: var(--header-height);
            padding-inline: var(--space-6);
        }
    }

    &__brand {
        grid-area: brand;
        display: inline-flex;
        gap: var(--space-2);
        align-items: center;
        padding-block: var(--space-3);
        color: var(--color-text);
        text-decoration: none;
    }

    &__brand-name {
        font-family: var(--font-heading);
        font-size: var(--font-size-lg);
        font-weight: 700;
        letter-spacing: -0.01em;
        white-space: nowrap;
    }

    &__nav {
        grid-area: nav;
        display: flex;
        gap: var(--space-1);
        margin-inline: calc(var(--space-3) * -1);
        overflow-x: auto;

        @include from(md) {
            margin-inline: 0;
            align-self: stretch;
        }
    }

    &__nav-link {
        display: inline-flex;
        align-items: center;
        padding-block: var(--space-3);
        padding-inline: var(--space-3);
        border-block-end: 2px solid transparent;
        color: var(--color-text-muted);
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        transition: color var(--transition-fast);

        &:hover {
            color: var(--color-text);
        }

        &--active {
            border-block-end-color: var(--color-accent);
            color: var(--color-text);
        }
    }

    &__controls {
        grid-area: controls;
        display: flex;
        gap: var(--space-2);
        align-items: center;
    }
}
</style>
