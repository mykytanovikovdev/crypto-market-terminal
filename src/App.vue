<script setup lang="ts">
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';

const { t } = useI18n();
const route = useRoute();

function updateDocumentTitle(): void {
    if (route.meta.hasOwnTitle) {
        return;
    }

    const titleKey = route.meta.titleKey;

    document.title = titleKey ? t('app.pageTitle', { page: t(titleKey) }) : 'Market Terminal';
}

watchEffect(updateDocumentTitle);
</script>

<template>
    <a class="app-shell__skip-link" href="#main-content">{{ t('app.skipToContent') }}</a>
    <AppHeader />
    <main id="main-content" class="app-shell__main" tabindex="-1">
        <RouterView />
    </main>
</template>

<style lang="scss" scoped>
@use '@/styles/breakpoints' as *;

.app-shell {
    &__skip-link {
        position: absolute;
        inset-block-start: var(--space-2);
        inset-inline-start: var(--space-2);
        z-index: 20;
        padding: var(--space-2) var(--space-4);
        background: var(--color-accent);
        border-radius: var(--radius-sm);
        color: var(--color-on-accent);
        font-weight: 600;
        transform: translateY(-200%);

        &:focus {
            transform: none;
        }
    }

    &__main {
        max-inline-size: var(--layout-max-width);
        margin-inline: auto;
        padding-block: var(--space-6) var(--space-12);
        padding-inline: var(--space-4);

        &:focus {
            outline: none;
        }

        @include from(md) {
            padding-block-start: var(--space-8);
            padding-inline: var(--space-6);
        }
    }
}
</style>
