import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '@/App.vue';
import { applyDocumentLocale } from '@/composables/useLocale';
import { i18n } from '@/i18n';
import { router } from '@/router';
import '@/styles/main.scss';

applyDocumentLocale(i18n.global.locale.value);

createApp(App).use(createPinia()).use(router).use(i18n).mount('#app');
