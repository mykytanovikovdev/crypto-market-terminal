<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    name: string;
    paragraphs: string[];
}>();

const { t } = useI18n();
const isExpanded = ref<boolean>(false);

const visibleParagraphs = computed(() =>
    isExpanded.value ? props.paragraphs : props.paragraphs.slice(0, 1),
);

function toggleExpanded(): void {
    isExpanded.value = !isExpanded.value;
}
</script>

<template>
    <section v-if="paragraphs.length > 0" class="coin-about">
        <h2 class="coin-about__title">{{ t('coinAbout.title', { name }) }}</h2>
        <div
            id="coin-about-text"
            class="coin-about__text"
            :class="{ 'coin-about__text--collapsed': !isExpanded }"
            lang="en"
            dir="ltr"
        >
            <p v-for="(paragraph, index) in visibleParagraphs" :key="index">{{ paragraph }}</p>
        </div>
        <button
            type="button"
            class="coin-about__toggle"
            aria-controls="coin-about-text"
            :aria-expanded="isExpanded"
            @click="toggleExpanded"
        >
            {{ isExpanded ? t('coinAbout.showLess') : t('coinAbout.showMore') }}
        </button>
    </section>
</template>

<style lang="scss" scoped>
.coin-about {
    &__title {
        margin-block-end: var(--space-3);
        font-size: var(--font-size-lg);
    }

    &__text {
        display: grid;
        gap: var(--space-3);
        max-inline-size: 72ch;
        color: var(--color-text-muted);
        line-height: 1.6;

        &--collapsed p {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-clamp: 3;
        }
    }

    &__toggle {
        margin-block-start: var(--space-2);
        padding: 0;
        background: none;
        border: 0;
        color: var(--color-accent);
        font-weight: 600;
        cursor: pointer;
    }
}
</style>
