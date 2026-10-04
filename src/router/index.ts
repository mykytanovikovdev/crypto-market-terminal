import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'markets',
            component: () => import('@/features/markets/MarketsPage.vue'),
            meta: { titleKey: 'nav.markets' },
        },
        {
            path: '/watchlist',
            name: 'watchlist',
            component: () => import('@/features/watchlist/WatchlistPage.vue'),
            meta: { titleKey: 'nav.watchlist' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/features/about/AboutPage.vue'),
            meta: { titleKey: 'nav.about' },
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: { name: 'markets' },
        },
    ],
});
