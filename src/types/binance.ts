export interface BinanceMiniTickerDto {
    e: '24hrMiniTicker';
    s: string;
    c: string;
    o: string;
}

export interface BinanceStreamMessageDto {
    stream: string;
    data: BinanceMiniTickerDto;
}

export type BinanceKlineDto = [
    openTimeMs: number,
    open: string,
    high: string,
    low: string,
    close: string,
    volume: string,
    ...rest: unknown[],
];
