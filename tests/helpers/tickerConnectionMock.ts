import { vi, type Mock } from 'vitest';
import type { TickerConnection } from '@/api/binanceSocket';

export type TickerConnectionMock = { [Key in keyof TickerConnection]: Mock<TickerConnection[Key]> };

export function createTickerConnectionMock(): TickerConnectionMock {
    return {
        setSymbols: vi.fn<TickerConnection['setSymbols']>(),
        pause: vi.fn<TickerConnection['pause']>(),
        resume: vi.fn<TickerConnection['resume']>(),
        close: vi.fn<TickerConnection['close']>(),
    };
}
