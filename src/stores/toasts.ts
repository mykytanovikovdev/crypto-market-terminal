import { defineStore } from 'pinia';
import { ref } from 'vue';

const TOAST_LIFETIME_MS = 10_000;

export interface Toast {
    id: number;
    title: string;
    body: string;
    imageUrl?: string;
}

export const useToastStore = defineStore('toasts', () => {
    const toasts = ref<Toast[]>([]);
    let nextToastId = 1;

    function dismissToast(toastId: number): void {
        toasts.value = toasts.value.filter((toast) => toast.id !== toastId);
    }

    function showToast(toast: Omit<Toast, 'id'>): void {
        const id = nextToastId;

        nextToastId += 1;
        toasts.value = [...toasts.value, { ...toast, id }];
        setTimeout(() => dismissToast(id), TOAST_LIFETIME_MS);
    }

    return { toasts, showToast, dismissToast };
});
