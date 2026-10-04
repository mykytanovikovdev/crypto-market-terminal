<script setup lang="ts">
import { computed } from 'vue';
import { getSeriesDirection } from '@/utils/priceDirection';
import { buildSparklinePath } from '@/utils/sparkline';

const props = defineProps<{
    points: number[];
    label: string;
}>();

const SPARKLINE_WIDTH = 112;
const SPARKLINE_HEIGHT = 40;

const path = computed(() => buildSparklinePath(props.points, SPARKLINE_WIDTH, SPARKLINE_HEIGHT));
const direction = computed(() => getSeriesDirection(props.points));
</script>

<template>
    <svg
        v-if="path"
        class="coin-sparkline"
        :class="`coin-sparkline--${direction}`"
        :viewBox="`0 -2 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT + 4}`"
        role="img"
        :aria-label="label"
    >
        <path class="coin-sparkline__line" :d="path" />
    </svg>
</template>

<style lang="scss" scoped>
.coin-sparkline {
    inline-size: 7rem;
    block-size: 2.5rem;
    margin-inline-start: auto;
    color: var(--color-text-muted);

    &--up {
        color: var(--color-up);
    }

    &--down {
        color: var(--color-down);
    }

    &__line {
        fill: none;
        stroke: currentcolor;
        stroke-width: 1.5;
        stroke-linejoin: round;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
    }
}
</style>
