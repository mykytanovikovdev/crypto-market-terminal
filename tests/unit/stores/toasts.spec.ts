import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToastStore } from '@/stores/toasts';

describe('toast store', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        setActivePinia(createPinia());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('shows toasts with unique ids and dismisses them on request', () => {
        const store = useToastStore();

        store.showToast({ title: 'One', body: 'First' });
        store.showToast({ title: 'Two', body: 'Second' });
        store.dismissToast(store.toasts[0]!.id);

        expect(store.toasts.map((toast) => toast.title)).toEqual(['Two']);
    });

    it('removes a toast automatically after ten seconds', () => {
        const store = useToastStore();

        store.showToast({ title: 'One', body: 'First' });
        vi.advanceTimersByTime(10_000);

        expect(store.toasts).toEqual([]);
    });
});
