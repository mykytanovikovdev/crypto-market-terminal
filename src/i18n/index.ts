import { createI18n } from 'vue-i18n';
import en from '@/i18n/locales/en';

export type MessageSchema = typeof en;

export const i18n = createI18n<[MessageSchema], 'en', false>({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en },
});
