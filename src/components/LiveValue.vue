<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
    value: number;
    text: string;
}>();

const FLASH_DURATION_MS = 900;

const flashDirection = ref<'up' | 'down' | null>(null);
let flashTimer: ReturnType<typeof setTimeout> | null = null;
let lastFlashedValue = props.value;

function clearFlash(): void {
    flashDirection.value = null;
    flashTimer = null;
}

function stopFlashTimer(): void {
    if (flashTimer !== null) {
        clearTimeout(flashTimer);
    }
}

function flashOnVisibleChange(): void {
    if (props.value === lastFlashedValue) {
        return;
    }

    stopFlashTimer();
    flashDirection.value = props.value > lastFlashedValue ? 'up' : 'down';
    lastFlashedValue = props.value;
    flashTimer = setTimeout(clearFlash, FLASH_DURATION_MS);
}

watch(() => props.text, flashOnVisibleChange);
onBeforeUnmount(stopFlashTimer);
</script>

<template>
    <span class="live-value" :class="flashDirection && `live-value--${flashDirection}`">
        {{ text }}
    </span>
</template>

<style lang="scss" scoped>
.live-value {
    transition: color var(--transition-flash);

    &--up {
        color: var(--color-up);
        transition: none;
    }

    &--down {
        color: var(--color-down);
        transition: none;
    }
}
</style>
