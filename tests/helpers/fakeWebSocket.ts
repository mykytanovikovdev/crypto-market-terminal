type Listener = (event: { data?: string }) => void;

export class FakeWebSocket {
    static readonly instances: FakeWebSocket[] = [];

    readonly url: string;
    readyState = 0;
    readonly sentMessages: { method: string; params: string[] }[] = [];
    private readonly listeners = new Map<string, Set<Listener>>();

    constructor(url: string) {
        this.url = url;
        FakeWebSocket.instances.push(this);
    }

    static reset(): void {
        FakeWebSocket.instances.length = 0;
    }

    static latest(): FakeWebSocket {
        const socket = FakeWebSocket.instances.at(-1);

        if (!socket) {
            throw new Error('No socket was created');
        }

        return socket;
    }

    addEventListener(type: string, listener: Listener): void {
        this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener));
    }

    removeEventListener(type: string, listener: Listener): void {
        this.listeners.get(type)?.delete(listener);
    }

    send(payload: string): void {
        this.sentMessages.push(JSON.parse(payload) as { method: string; params: string[] });
    }

    close(): void {
        this.readyState = 3;
    }

    simulateOpen(): void {
        this.readyState = 1;
        this.emit('open', {});
    }

    simulateMessage(data: unknown): void {
        this.emit('message', { data: JSON.stringify(data) });
    }

    simulateDrop(): void {
        this.readyState = 3;
        this.emit('close', {});
    }

    private emit(type: string, event: { data?: string }): void {
        for (const listener of this.listeners.get(type) ?? []) {
            listener(event);
        }
    }
}

export function createFakeSocket(url: string): WebSocket {
    return new FakeWebSocket(url) as unknown as WebSocket;
}

export function miniTickerMessage(symbol: string, lastPrice: number, openPrice: number) {
    return {
        stream: `${symbol.toLowerCase()}@miniTicker`,
        data: { e: '24hrMiniTicker', s: symbol, c: String(lastPrice), o: String(openPrice) },
    };
}
