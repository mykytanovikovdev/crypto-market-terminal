import { afterEach, describe, expect, it } from 'vitest';
import { useLocale } from '@/composables/useLocale';
import { STORAGE_KEYS } from '@/utils/storage';

describe('useLocale', () => {
    afterEach(() => {
        useLocale().setLocale('en');
    });

    it('switches to Persian with right-to-left direction and Latin digits', () => {
        const { currentLocale, numberLocale, setLocale } = useLocale();

        setLocale('fa');

        expect(currentLocale.value).toBe('fa');
        expect(numberLocale.value).toBe('fa-IR-u-nu-latn');
        expect(document.documentElement.lang).toBe('fa');
        expect(document.documentElement.dir).toBe('rtl');
        expect(localStorage.getItem(STORAGE_KEYS.locale)).toBe('fa');
    });

    it('restores left-to-right direction for English', () => {
        const { setLocale } = useLocale();

        setLocale('fa');
        setLocale('en');

        expect(document.documentElement.dir).toBe('ltr');
    });
});
