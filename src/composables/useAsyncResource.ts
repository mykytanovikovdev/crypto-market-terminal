import { shallowRef } from 'vue';
import { toApiError, type ApiError } from '@/api/http';

export function useAsyncResource<TArgs extends unknown[], TData>(
    fetcher: (...args: TArgs) => Promise<TData>,
    initialData: TData,
) {
    const data = shallowRef<TData>(initialData);
    const isLoading = shallowRef<boolean>(false);
    const error = shallowRef<ApiError | null>(null);
    const updatedAt = shallowRef<Date | null>(null);
    let latestRequestId = 0;

    async function load(...args: TArgs): Promise<void> {
        const requestId = ++latestRequestId;
        const isLatestRequest = () => requestId === latestRequestId;

        isLoading.value = true;
        error.value = null;

        try {
            const result = await fetcher(...args);

            if (isLatestRequest()) {
                data.value = result;
                updatedAt.value = new Date();
            }
        } catch (loadError) {
            if (isLatestRequest()) {
                error.value = toApiError(loadError);
            }
        } finally {
            if (isLatestRequest()) {
                isLoading.value = false;
            }
        }
    }

    function isFresh(maxAgeMs: number): boolean {
        return updatedAt.value !== null && Date.now() - updatedAt.value.getTime() < maxAgeMs;
    }

    return { data, isLoading, error, updatedAt, load, isFresh };
}
