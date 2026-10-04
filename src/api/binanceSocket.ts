import type { BinanceCombinedStreamMessageDto } from '@/types/binance';
import type { TickerUpdate } from '@/types/market';

const BINANCE_STREAM_URL = 'wss://stream.binance.com:9443/stream';

function buildTradeStreamUrl(symbols: string[]): string {
    const streams = symbols.map((symbol) => `${symbol.toLowerCase()}@trade`).join('/');

    return `${BINANCE_STREAM_URL}?streams=${streams}`;
}

export function parseTradeMessage(rawMessage: string): TickerUpdate | null {
    const message = JSON.parse(rawMessage) as Partial<BinanceCombinedStreamMessageDto>;
    const trade = message.data;

    if (!trade?.s || !trade.p) {
        return null;
    }

    return { symbol: trade.s, price: Number.parseFloat(trade.p) };
}

export function subscribeToTicker(
    symbols: string[],
    onTick: (update: TickerUpdate) => void,
): () => void {
    const socket = new WebSocket(buildTradeStreamUrl(symbols));

    function handleMessage(event: MessageEvent<string>): void {
        const update = parseTradeMessage(event.data);

        if (update) {
            onTick(update);
        }
    }

    socket.addEventListener('message', handleMessage);

    return function unsubscribe(): void {
        socket.removeEventListener('message', handleMessage);
        socket.close();
    };
}
