<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { CoinLink } from '@/types/coin';

defineProps<{
    links: CoinLink[];
}>();

const { t } = useI18n();
</script>

<template>
    <section v-if="links.length > 0" class="coin-links">
        <h2 class="coin-links__title">{{ t('coinLinks.title') }}</h2>
        <ul class="coin-links__list">
            <li v-for="link in links" :key="link.kind">
                <a
                    class="coin-links__link"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {{ t(`coinLinks.${link.kind}`) }}
                </a>
            </li>
        </ul>
    </section>
</template>

<style lang="scss" scoped>
.coin-links {
    padding-block-end: var(--space-4);

    &__title {
        padding-block: var(--space-4) var(--space-3);
        font-size: var(--font-size-lg);
    }

    &__list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
    }

    &__link {
        display: inline-block;
        padding-block: var(--space-1);
        padding-inline: var(--space-3);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font-size: var(--font-size-sm);
        font-weight: 600;
        text-decoration: none;

        &:hover {
            border-color: var(--color-accent);
        }
    }
}
</style>
