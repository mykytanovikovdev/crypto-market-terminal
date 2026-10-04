import { computed } from 'vue';
import { i18n } from '@/i18n';
import { getLocaleSettings, type AppLocale } from '@/i18n/locales';
import { STORAGE_KEYS, writeStorage } from '@/utils/storage';

export function applyDocumentLocale(locale: AppLocale): void {
    document.documentElement.lang = locale;
    document.documentElement.dir = getLocaleSettings(locale).direction;
}

export function useLocale() {
    const currentLocale = computed(() => i18n.global.locale.value);
    const numberLocale = computed(() => getLocaleSettings(currentLocale.value).numberLocale);

    function setLocale(locale: AppLocale): void {
        i18n.global.locale.value = locale;
        applyDocumentLocale(locale);
        writeStorage(STORAGE_KEYS.locale, locale);
    }

    return { currentLocale, numberLocale, setLocale };
}
