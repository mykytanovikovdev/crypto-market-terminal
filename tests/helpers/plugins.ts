import { createPinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { i18n } from '@/i18n';

const stubPage = { template: '<div />' };

export function createTestRouter() {
    return createRouter({
        history: createMemoryHistory(),
        routes: [
            { path: '/', name: 'markets', component: stubPage },
            { path: '/watchlist', name: 'watchlist', component: stubPage },
            { path: '/about', name: 'about', component: stubPage },
        ],
    });
}

export function createTestPlugins() {
    i18n.global.locale.value = 'en';

    return [i18n, createPinia(), createTestRouter()];
}
