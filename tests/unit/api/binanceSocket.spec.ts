import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    createTickerConnection,
    parseMiniTickerMessage,
    type TickerConnectionHandlers,
} from '@/api/binanceSocket';
import type { LiveConnectionStatus } from '@/types/market';
import { createFakeSocket, FakeWebSocket, miniTickerMessage } from '../../helpers/fakeWebSocket';

const ENDPOINTS = ['wss://primary.test/stream', 'wss://backup.test/stream'];

function createConnection() {
    const statuses: LiveConnectionStatus[] = [];
    const handlers: TickerConnectionHandlers = {
        onUpdate: vi.fn(),
        onStatusChange: (status) => statuses.push(status),
    };
    const connection = createTickerConnection(handlers, {
        endpoints: ENDPOINTS,
        createSocket: createFakeSocket,
    });

    return { connection, handlers, statuses };
}

describe('parseMiniTickerMessage', () => {
    it('extracts the symbol, last price and 24h open price', () => {
        const rawMessage = JSON.stringify(miniTickerMessage('BTCUSDT', 85549.06, 84861.33));

        expect(parseMiniTickerMessage(rawMessage)).toEqual({
            symbol: 'BTCUSDT',
            lastPrice: 85549.06,
            openPrice: 84861.33,
        });
    });

    it('ignores subscription acknowledgements and malformed prices', () => {
        expect(parseMiniTickerMessage(JSON.stringify({ result: null, id: 1 }))).toBeNull();
        expect(
            parseMiniTickerMessage(JSON.stringify(miniTickerMessage('BTCUSDT', Number.NaN, 1))),
        ).toBeNull();
    });
});

describe('createTickerConnection', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        FakeWebSocket.reset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('stays disconnected until there is something to subscribe to', () => {
        createConnection();

        expect(FakeWebSocket.instances).toHaveLength(0);
    });

    it('connects, subscribes on open and forwards ticker updates', () => {
        const { connection, handlers, statuses } = createConnection();

        connection.setSymbols(['BTCUSDT', 'ETHUSDT']);
        const socket = FakeWebSocket.latest();
        socket.simulateOpen();
        socket.simulateMessage(miniTickerMessage('BTCUSDT', 2, 1));

        expect(socket.url).toBe(ENDPOINTS[0]);
        expect(statuses).toEqual(['connecting', 'live']);
        expect(socket.sentMessages).toEqual([
            expect.objectContaining({
                method: 'SUBSCRIBE',
                params: ['btcusdt@miniTicker', 'ethusdt@miniTicker'],
            }),
        ]);
        expect(handlers.onUpdate).toHaveBeenCalledWith({
            symbol: 'BTCUSDT',
            lastPrice: 2,
            openPrice: 1,
        });
    });

    it('only sends the difference when the symbol list changes', () => {
        const { connection } = createConnection();

        connection.setSymbols(['BTCUSDT', 'ETHUSDT']);
        const socket = FakeWebSocket.latest();
        socket.simulateOpen();
        connection.setSymbols(['ETHUSDT', 'SOLUSDT']);

        expect(socket.sentMessages.slice(1)).toEqual([
            expect.objectContaining({ method: 'UNSUBSCRIBE', params: ['btcusdt@miniTicker'] }),
            expect.objectContaining({ method: 'SUBSCRIBE', params: ['solusdt@miniTicker'] }),
        ]);
        expect(FakeWebSocket.instances).toHaveLength(1);
    });

    it('reconnects with growing delays and alternates endpoints', () => {
        const { connection, statuses } = createConnection();

        connection.setSymbols(['BTCUSDT']);
        FakeWebSocket.latest().simulateDrop();

        expect(statuses.at(-1)).toBe('reconnecting');
        vi.advanceTimersByTime(999);
        expect(FakeWebSocket.instances).toHaveLength(1);
        vi.advanceTimersByTime(1);
        expect(FakeWebSocket.latest().url).toBe(ENDPOINTS[1]);

        FakeWebSocket.latest().simulateDrop();
        vi.advanceTimersByTime(2_000);
        expect(FakeWebSocket.instances).toHaveLength(3);
        expect(FakeWebSocket.latest().url).toBe(ENDPOINTS[0]);
    });

    it('reports live prices as unavailable after repeated failures and recovers', () => {
        const { connection, statuses } = createConnection();

        connection.setSymbols(['BTCUSDT']);

        for (let attempt = 0; attempt < 4; attempt += 1) {
            FakeWebSocket.latest().simulateDrop();
            vi.runOnlyPendingTimers();
        }

        expect(statuses).toContain('unavailable');

        FakeWebSocket.latest().simulateOpen();
        expect(statuses.at(-1)).toBe('live');
    });

    it('resubscribes to every stream after reconnecting', () => {
        const { connection } = createConnection();

        connection.setSymbols(['BTCUSDT']);
        FakeWebSocket.latest().simulateOpen();
        FakeWebSocket.latest().simulateDrop();
        vi.runOnlyPendingTimers();
        FakeWebSocket.latest().simulateOpen();

        expect(FakeWebSocket.latest().sentMessages).toEqual([
            expect.objectContaining({ method: 'SUBSCRIBE', params: ['btcusdt@miniTicker'] }),
        ]);
    });

    it('closes the socket while paused and reconnects on resume', () => {
        const { connection, statuses } = createConnection();

        connection.setSymbols(['BTCUSDT']);
        const firstSocket = FakeWebSocket.latest();
        firstSocket.simulateOpen();
        connection.pause();

        expect(firstSocket.readyState).toBe(3);
        expect(statuses.at(-1)).toBe('paused');
        vi.runOnlyPendingTimers();
        expect(FakeWebSocket.instances).toHaveLength(1);

        connection.resume();
        expect(FakeWebSocket.instances).toHaveLength(2);
    });

    it('disconnects and goes idle when no symbols are left', () => {
        const { connection, statuses } = createConnection();

        connection.setSymbols(['BTCUSDT']);
        const socket = FakeWebSocket.latest();
        socket.simulateOpen();
        connection.setSymbols([]);
        vi.runOnlyPendingTimers();

        expect(socket.readyState).toBe(3);
        expect(statuses.at(-1)).toBe('idle');
        expect(FakeWebSocket.instances).toHaveLength(1);
    });
});
