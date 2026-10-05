import type { BinanceStreamMessageDto } from '@/types/binance';
import type { LiveConnectionStatus, TickerUpdate } from '@/types/market';

export const BINANCE_STREAM_ENDPOINTS = [
    'wss://stream.binance.com:9443/stream',
    'wss://data-stream.binance.vision/stream',
] as const;

const INITIAL_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;
const ATTEMPTS_BEFORE_UNAVAILABLE = 4;
const MAX_STREAMS_PER_MESSAGE = 200;

export interface TickerConnectionHandlers {
    onUpdate: (update: TickerUpdate) => void;
    onStatusChange: (status: LiveConnectionStatus) => void;
}

export interface TickerConnectionOptions {
    endpoints?: readonly string[];
    createSocket?: (url: string) => WebSocket;
}

export interface TickerConnection {
    setSymbols: (symbols: string[]) => void;
    pause: () => void;
    resume: () => void;
    close: () => void;
}

export function toStreamName(symbol: string): string {
    return `${symbol.toLowerCase()}@miniTicker`;
}

export function parseMiniTickerMessage(rawMessage: string): TickerUpdate | null {
    const message = JSON.parse(rawMessage) as Partial<BinanceStreamMessageDto>;
    const ticker = message.data;

    if (ticker?.e !== '24hrMiniTicker') {
        return null;
    }

    const lastPrice = Number.parseFloat(ticker.c);
    const openPrice = Number.parseFloat(ticker.o);

    if (!Number.isFinite(lastPrice) || !Number.isFinite(openPrice) || openPrice <= 0) {
        return null;
    }

    return { symbol: ticker.s, lastPrice, openPrice };
}

function chunk<TItem>(items: TItem[], size: number): TItem[][] {
    return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
        items.slice(index * size, (index + 1) * size),
    );
}

function createBrowserSocket(url: string): WebSocket {
    return new WebSocket(url);
}

export function createTickerConnection(
    handlers: TickerConnectionHandlers,
    options: TickerConnectionOptions = {},
): TickerConnection {
    const endpoints = options.endpoints ?? BINANCE_STREAM_ENDPOINTS;
    const createSocket = options.createSocket ?? createBrowserSocket;

    let socket: WebSocket | null = null;
    let wantedStreams = new Set<string>();
    let subscribedStreams = new Set<string>();
    let endpointIndex = 0;
    let failedAttempts = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isPaused = false;
    let requestId = 0;

    function setStatus(status: LiveConnectionStatus): void {
        handlers.onStatusChange(status);
    }

    function sendStreamRequest(method: 'SUBSCRIBE' | 'UNSUBSCRIBE', streams: string[]): void {
        for (const params of chunk(streams, MAX_STREAMS_PER_MESSAGE)) {
            requestId += 1;
            socket?.send(JSON.stringify({ method, params, id: requestId }));
        }
    }

    function syncSubscriptions(): void {
        if (socket?.readyState !== WebSocket.OPEN) {
            return;
        }

        const toSubscribe = [...wantedStreams].filter((stream) => !subscribedStreams.has(stream));
        const toUnsubscribe = [...subscribedStreams].filter((stream) => !wantedStreams.has(stream));

        if (toUnsubscribe.length > 0) {
            sendStreamRequest('UNSUBSCRIBE', toUnsubscribe);
        }

        if (toSubscribe.length > 0) {
            sendStreamRequest('SUBSCRIBE', toSubscribe);
        }

        subscribedStreams = new Set(wantedStreams);
    }

    function clearReconnectTimer(): void {
        if (reconnectTimer !== null) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
    }

    function handleOpen(): void {
        failedAttempts = 0;
        setStatus('live');
        syncSubscriptions();
    }

    function handleMessage(event: MessageEvent<string>): void {
        const update = parseMiniTickerMessage(event.data);

        if (update) {
            handlers.onUpdate(update);
        }
    }

    function scheduleReconnect(): void {
        failedAttempts += 1;
        endpointIndex = (endpointIndex + 1) % endpoints.length;
        setStatus(failedAttempts >= ATTEMPTS_BEFORE_UNAVAILABLE ? 'unavailable' : 'reconnecting');

        const delay = Math.min(
            INITIAL_RECONNECT_DELAY_MS * 2 ** (failedAttempts - 1),
            MAX_RECONNECT_DELAY_MS,
        );

        reconnectTimer = setTimeout(connect, delay);
    }

    function handleClose(): void {
        detachSocket();

        if (!isPaused && wantedStreams.size > 0) {
            scheduleReconnect();
        }
    }

    function detachSocket(): void {
        socket?.removeEventListener('open', handleOpen);
        socket?.removeEventListener('message', handleMessage);
        socket?.removeEventListener('close', handleClose);
        socket = null;
        subscribedStreams = new Set();
    }

    function disconnect(): void {
        clearReconnectTimer();
        const closingSocket = socket;

        detachSocket();
        closingSocket?.close();
    }

    function connect(): void {
        clearReconnectTimer();

        if (socket || isPaused || wantedStreams.size === 0) {
            return;
        }

        setStatus(failedAttempts === 0 ? 'connecting' : 'reconnecting');
        socket = createSocket(endpoints[endpointIndex] ?? BINANCE_STREAM_ENDPOINTS[0]);
        socket.addEventListener('open', handleOpen);
        socket.addEventListener('message', handleMessage);
        socket.addEventListener('close', handleClose);
    }

    function setSymbols(symbols: string[]): void {
        wantedStreams = new Set(symbols.map(toStreamName));

        if (wantedStreams.size === 0) {
            disconnect();
            failedAttempts = 0;
            setStatus('idle');

            return;
        }

        if (socket) {
            syncSubscriptions();
        } else if (reconnectTimer === null) {
            connect();
        }
    }

    function pause(): void {
        if (isPaused) {
            return;
        }

        isPaused = true;
        disconnect();

        if (wantedStreams.size > 0) {
            setStatus('paused');
        }
    }

    function resume(): void {
        if (!isPaused) {
            return;
        }

        isPaused = false;
        failedAttempts = 0;
        connect();
    }

    function close(): void {
        wantedStreams = new Set();
        disconnect();
        setStatus('idle');
    }

    return { setSymbols, pause, resume, close };
}
