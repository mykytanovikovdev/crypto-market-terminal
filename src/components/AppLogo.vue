<template>
    <svg class="app-logo" viewBox="0 0 32 32" aria-hidden="true">
        <rect class="app-logo__badge" width="32" height="32" rx="8" />
        <path class="app-logo__wick" d="M11 7v18M21 5v16" />
        <rect class="app-logo__candle" x="8" y="11" width="6" height="10" rx="1.5" />
        <rect class="app-logo__candle" x="18" y="8" width="6" height="9" rx="1.5" />
    </svg>
</template>

<style lang="scss" scoped>
.app-logo {
    inline-size: 2rem;
    block-size: 2rem;

    &__badge {
        fill: var(--color-accent);
    }

    &__wick {
        stroke: var(--color-on-accent);
        stroke-width: 2;
        stroke-linecap: round;
    }

    &__candle {
        fill: var(--color-on-accent);
    }
}
</style>
