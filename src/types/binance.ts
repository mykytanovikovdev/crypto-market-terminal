export interface BinanceTradeEventDto {
    e: 'trade';
    s: string;
    p: string;
}

export interface BinanceCombinedStreamMessageDto {
    stream: string;
    data: BinanceTradeEventDto;
}
