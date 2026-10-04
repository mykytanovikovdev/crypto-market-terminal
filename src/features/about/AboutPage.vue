<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import PageHeader from '@/components/PageHeader.vue';

const REPOSITORY_URL = 'https://github.com/mykytanovikovdev/crypto-market-terminal';
const TECH_STACK = [
    'Vue 3',
    'TypeScript',
    'Pinia',
    'Vue Router',
    'Vue I18n',
    'Axios',
    'Sass',
    'Vite',
    'Vitest',
];

const { t } = useI18n();
</script>

<template>
    <article class="about-page">
        <PageHeader :title="t('about.title')" :description="t('about.intro')" />

        <section class="about-page__section">
            <h2 class="about-page__heading">{{ t('about.dataTitle') }}</h2>
            <p class="about-page__text">{{ t('about.dataText') }}</p>
        </section>

        <section class="about-page__section">
            <h2 class="about-page__heading">{{ t('about.stackTitle') }}</h2>
            <ul class="about-page__stack">
                <li v-for="technology in TECH_STACK" :key="technology" class="about-page__tag">
                    {{ technology }}
                </li>
            </ul>
        </section>

        <section class="about-page__section">
            <h2 class="about-page__heading">{{ t('about.sourceTitle') }}</h2>
            <a class="about-page__link" :href="REPOSITORY_URL" rel="noopener">
                {{ t('about.sourceLink') }}
            </a>
        </section>

        <p class="about-page__disclaimer">{{ t('about.disclaimer') }}</p>
    </article>
</template>

<style lang="scss" scoped>
.about-page {
    max-inline-size: 45rem;

    &__section {
        display: grid;
        gap: var(--space-2);
        padding-block: var(--space-5);
        border-block-start: 1px solid var(--color-border);
    }

    &__heading {
        font-size: var(--font-size-lg);
    }

    &__text {
        color: var(--color-text-muted);
    }

    &__stack {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
    }

    &__tag {
        padding-block: var(--space-1);
        padding-inline: var(--space-3);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        font-size: var(--font-size-sm);
        font-weight: 500;
    }

    &__link {
        font-weight: 600;
    }

    &__disclaimer {
        padding-block-start: var(--space-5);
        border-block-start: 1px solid var(--color-border);
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
    }
}
</style>
