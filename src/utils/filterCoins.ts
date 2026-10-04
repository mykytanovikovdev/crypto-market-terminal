import type { CoinListing, MovementFilter } from '@/types/market';
import { getPriceDirection } from '@/utils/priceDirection';

export interface CoinFilters {
    query: string;
    movement: MovementFilter;
}

function matchesQuery(coin: CoinListing, normalizedQuery: string): boolean {
    return (
        coin.name.toLowerCase().includes(normalizedQuery) ||
        coin.symbol.toLowerCase().includes(normalizedQuery)
    );
}

function matchesMovement(coin: CoinListing, movement: MovementFilter): boolean {
    if (movement === 'all') {
        return true;
    }

    if (coin.change24h === null) {
        return false;
    }

    return getPriceDirection(coin.change24h) === (movement === 'gainers' ? 'up' : 'down');
}

export function filterCoins(coins: CoinListing[], filters: CoinFilters): CoinListing[] {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return coins.filter(
        (coin) =>
            (normalizedQuery === '' || matchesQuery(coin, normalizedQuery)) &&
            matchesMovement(coin, filters.movement),
    );
}
