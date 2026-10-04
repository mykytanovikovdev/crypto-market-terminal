const QUOTE_CURRENCY = 'USD';
const SUB_DOLLAR_SIGNIFICANT_DIGITS = 4;

function roundsToAtLeastOneDollar(value: number): boolean {
    return Number(value.toPrecision(SUB_DOLLAR_SIGNIFICANT_DIGITS)) >= 1;
}

export function formatPrice(value: number, locale: string): string {
    const options: Intl.NumberFormatOptions = roundsToAtLeastOneDollar(value)
        ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        : {
              minimumSignificantDigits: SUB_DOLLAR_SIGNIFICANT_DIGITS,
              maximumSignificantDigits: SUB_DOLLAR_SIGNIFICANT_DIGITS,
          };

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: QUOTE_CURRENCY,
        ...options,
    }).format(value);
}

export function formatPercent(percent: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(percent) / 100);
}

export function formatCompactCurrency(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: QUOTE_CURRENCY,
        notation: 'compact',
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatCompactNumber(value: number, locale: string): string {
    return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatTime(date: Date, locale: string): string {
    return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date);
}
