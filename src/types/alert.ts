export type AlertDirection = 'above' | 'below';

export interface PriceAlert {
    id: string;
    coinId: string;
    symbol: string;
    name: string;
    imageUrl: string;
    targetPrice: number;
    referencePrice: number;
    direction: AlertDirection;
    createdAt: number;
    triggeredAt: number | null;
    triggeredPrice: number | null;
}

export interface AlertCoin {
    id: string;
    symbol: string;
    name: string;
    imageUrl: string;
}
