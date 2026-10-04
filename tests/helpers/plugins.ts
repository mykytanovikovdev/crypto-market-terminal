import { createI18n } from 'vue-i18n';
import en from '@/i18n/locales/en';

export function createTestI18n() {
    return createI18n({
        legacy: false,
        locale: 'en',
        messages: { en },
    });
}
