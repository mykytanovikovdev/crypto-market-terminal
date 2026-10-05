import type { CoinListing, LiveQuote, TickerUpdate } from '@/types/market';

const QUOTE_ASSET = 'USDT';
const VALID_BASE_ASSET = /^[A-Z0-9]{2,15}$/;
const MAX_PRICE_DEVIATION = 0.1;

export function toBinanceSymbol(coinSymbol: string): string | null {
    const baseAsset = coinSymbol.toUpperCase();

    if (baseAsset === QUOTE_ASSET || !VALID_BASE_ASSET.test(baseAsset)) {
        return null;
    }

    return `${baseAsset}${QUOTE_ASSET}`;
}

// Tickers are not unique across exchanges: a Binance pair may belong to a different coin with
// the same symbol. A live price far from the CoinGecko reference is treated as such a mismatch.
export function isPlausibleLivePrice(referencePrice: number, livePrice: number): boolean {
    if (referencePrice <= 0 || livePrice <= 0) {
        return false;
    }

    return Math.abs(livePrice - referencePrice) / referencePrice <= MAX_PRICE_DEVIATION;
}

export function toLiveQuote(update: TickerUpdate): LiveQuote {
    return {
        price: update.lastPrice,
        change24h: ((update.lastPrice - update.openPrice) / update.openPrice) * 100,
    };
}

export function applyLiveQuote(coin: CoinListing, quote: LiveQuote | undefined): CoinListing {
    return quote ? { ...coin, price: quote.price, change24h: quote.change24h } : coin;
}
