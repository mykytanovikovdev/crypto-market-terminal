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
