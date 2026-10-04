const QUOTE_CURRENCY = 'USD';
const WHOLE_DOLLAR_THRESHOLD = 1000;
const SUB_DOLLAR_SIGNIFICANT_DIGITS = 4;

export function formatPrice(value: number, locale: string): string {
    const options: Intl.NumberFormatOptions = { style: 'currency', currency: QUOTE_CURRENCY };

    if (value >= WHOLE_DOLLAR_THRESHOLD) {
        options.maximumFractionDigits = 0;
    } else if (value < 1) {
        options.maximumSignificantDigits = SUB_DOLLAR_SIGNIFICANT_DIGITS;
    } else {
        options.minimumFractionDigits = 2;
        options.maximumFractionDigits = 2;
    }

    return new Intl.NumberFormat(locale, options).format(value);
}

export function formatPercentChange(percent: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: 'exceptZero',
    }).format(percent / 100);
}

export function formatMarketCap(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: QUOTE_CURRENCY,
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}
