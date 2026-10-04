import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/http';
import { useAsyncResource } from '@/composables/useAsyncResource';

function createDeferred<TValue>() {
    let resolve: (value: TValue) => void = () => undefined;
    const promise = new Promise<TValue>((resolvePromise) => {
        resolve = resolvePromise;
    });

    return { promise, resolve };
}

describe('useAsyncResource', () => {
    it('stores data, clears the loading flag and records the update time', async () => {
        const resource = useAsyncResource(async (value: number) => value * 2, 0);

        await resource.load(21);

        expect(resource.data.value).toBe(42);
        expect(resource.isLoading.value).toBe(false);
        expect(resource.updatedAt.value).toBeInstanceOf(Date);
    });

    it('converts failures to ApiError and keeps previous data', async () => {
        const resource = useAsyncResource(async () => {
            throw new ApiError('network', 'offline');
        }, 'previous');

        await resource.load();

        expect(resource.data.value).toBe('previous');
        expect(resource.error.value?.kind).toBe('network');
    });

    it('ignores a slow response that arrives after a newer request', async () => {
        const slow = createDeferred<string>();
        const fast = createDeferred<string>();
        const fetcher = vi
            .fn<() => Promise<string>>()
            .mockReturnValueOnce(slow.promise)
            .mockReturnValueOnce(fast.promise);
        const resource = useAsyncResource(fetcher, '');

        const slowLoad = resource.load();
        const fastLoad = resource.load();
        fast.resolve('newest');
        await fastLoad;
        slow.resolve('outdated');
        await slowLoad;

        expect(resource.data.value).toBe('newest');
        expect(resource.isLoading.value).toBe(false);
    });

    it('reports freshness relative to the last successful load', async () => {
        vi.useFakeTimers();
        const resource = useAsyncResource(async () => 'data', '');

        expect(resource.isFresh(60_000)).toBe(false);

        await resource.load();
        expect(resource.isFresh(60_000)).toBe(true);

        vi.advanceTimersByTime(60_001);
        expect(resource.isFresh(60_000)).toBe(false);

        vi.useRealTimers();
    });
});
