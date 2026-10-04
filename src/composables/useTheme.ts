import { readonly, ref } from 'vue';
import { STORAGE_KEYS, writeStorage } from '@/utils/storage';

export type Theme = 'light' | 'dark';

function readDocumentTheme(): Theme {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

const currentTheme = ref<Theme>(readDocumentTheme());

export function useTheme() {
    function setTheme(theme: Theme): void {
        currentTheme.value = theme;
        document.documentElement.dataset.theme = theme;
        writeStorage(STORAGE_KEYS.theme, theme);
    }

    function toggleTheme(): void {
        setTheme(currentTheme.value === 'dark' ? 'light' : 'dark');
    }

    return { currentTheme: readonly(currentTheme), setTheme, toggleTheme };
}
