export interface PriceExtreme {
    price: number;
    date: Date;
    changePercent: number;
}

export type CoinLinkKind = 'website' | 'whitepaper' | 'explorer' | 'github' | 'reddit';

export interface CoinLink {
    kind: CoinLinkKind;
    url: string;
}

export interface CoinDetails {
    id: string;
    symbol: string;
    name: string;
    imageUrl: string;
    rank: number | null;
    price: number;
    change1h: number | null;
    change24h: number | null;
    change7d: number | null;
    change30d: number | null;
    change1y: number | null;
    marketCap: number;
    volume24h: number;
    fullyDilutedValuation: number | null;
    high24h: number | null;
    low24h: number | null;
    circulatingSupply: number;
    maxSupply: number | null;
    allTimeHigh: PriceExtreme | null;
    allTimeLow: PriceExtreme | null;
    descriptionParagraphs: string[];
    links: CoinLink[];
}
