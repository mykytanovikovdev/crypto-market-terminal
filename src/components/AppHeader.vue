<template>
    <header class="app-header">
        <RouterLink class="app-header__brand" :to="{ name: 'market' }">
            Market<span class="app-header__brand-dot">.</span>Terminal
        </RouterLink>
    </header>
</template>

<style lang="scss" scoped>
.app-header {
    padding-block-end: var(--space-4);
    border-block-end: 1px solid var(--color-line);

    &__brand {
        font-size: var(--font-size-lg);
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--color-text);
        text-decoration: none;
        text-transform: uppercase;
    }

    &__brand-dot {
        color: var(--color-amber);
    }
}
</style>
