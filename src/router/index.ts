import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'market',
            component: () => import('@/features/market-table/MarketOverview.vue'),
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'market' },
        },
    ],
});
