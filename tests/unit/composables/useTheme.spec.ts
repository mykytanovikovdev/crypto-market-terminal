import { describe, expect, it } from 'vitest';
import { useTheme } from '@/composables/useTheme';
import { STORAGE_KEYS } from '@/utils/storage';

describe('useTheme', () => {
    it('switches the document theme and remembers the choice', () => {
        const { currentTheme, setTheme, toggleTheme } = useTheme();

        setTheme('light');
        toggleTheme();

        expect(currentTheme.value).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(localStorage.getItem(STORAGE_KEYS.theme)).toBe('dark');

        toggleTheme();

        expect(currentTheme.value).toBe('light');
        expect(document.documentElement.dataset.theme).toBe('light');
    });
});
