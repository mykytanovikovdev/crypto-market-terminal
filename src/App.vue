<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
    <div class="app-shell">
        <AppHeader />
        <main class="app-shell__main">
            <RouterView />
        </main>
    </div>
</template>

<style lang="scss" scoped>
.app-shell {
    max-inline-size: var(--layout-max-width);
    margin-inline: auto;
    padding-block: var(--space-8) var(--space-16);
    padding-inline: var(--space-4);
}
</style>
