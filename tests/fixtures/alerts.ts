import type { AlertCoin, PriceAlert } from '@/types/alert';

export const bitcoinAlertCoin: AlertCoin = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    imageUrl: 'https://example.test/bitcoin.png',
};

export function createAlert(overrides: Partial<PriceAlert> = {}): PriceAlert {
    return {
        id: 'alert-1',
        coinId: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        imageUrl: 'https://example.test/bitcoin.png',
        targetPrice: 90000,
        referencePrice: 85000,
        direction: 'above',
        createdAt: 1_790_000_000_000,
        triggeredAt: null,
        triggeredPrice: null,
        ...overrides,
    };
}
