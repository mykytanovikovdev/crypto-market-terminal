import { createI18n } from 'vue-i18n';
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from '@/i18n/locales';
import en from '@/i18n/locales/en';
import fa from '@/i18n/locales/fa';
import { readStorage, STORAGE_KEYS } from '@/utils/storage';

export type MessageSchema = typeof en;

function resolveInitialLocale(): AppLocale {
    const savedLocale = readStorage(STORAGE_KEYS.locale);

    return isAppLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
}

export const i18n = createI18n<[MessageSchema], AppLocale, false>({
    legacy: false,
    locale: resolveInitialLocale(),
    fallbackLocale: DEFAULT_LOCALE,
    messages: { en, fa },
});
