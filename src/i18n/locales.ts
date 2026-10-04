export const SUPPORTED_LOCALES = ['en', 'fa'] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export type TextDirection = 'ltr' | 'rtl';

interface LocaleSettings {
    direction: TextDirection;
    numberLocale: string;
    shortLabel: string;
    nativeName: string;
}

export const DEFAULT_LOCALE: AppLocale = 'en';

const LOCALE_SETTINGS: Record<AppLocale, LocaleSettings> = {
    en: { direction: 'ltr', numberLocale: 'en-US', shortLabel: 'EN', nativeName: 'English' },
    fa: {
        direction: 'rtl',
        numberLocale: 'fa-IR-u-nu-latn',
        shortLabel: 'FA',
        nativeName: 'فارسی',
    },
};

export function isAppLocale(value: unknown): value is AppLocale {
    return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function getLocaleSettings(locale: AppLocale): LocaleSettings {
    return LOCALE_SETTINGS[locale];
}
