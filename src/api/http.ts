import axios, { isAxiosError, type AxiosInstance } from 'axios';

const REQUEST_TIMEOUT_MS = 10_000;
const HTTP_TOO_MANY_REQUESTS = 429;

export type ApiErrorKind = 'rateLimited' | 'network' | 'http' | 'unknown';

export class ApiError extends Error {
    readonly kind: ApiErrorKind;
    readonly status: number | null;

    constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
        super(message);
        this.name = 'ApiError';
        this.kind = kind;
        this.status = status;
    }
}

export function toApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (!isAxiosError(error)) {
        return new ApiError('unknown', 'Unexpected error');
    }

    if (!error.response) {
        return new ApiError('network', error.message);
    }

    const { status } = error.response;

    if (status === HTTP_TOO_MANY_REQUESTS) {
        return new ApiError('rateLimited', 'Too many requests', status);
    }

    return new ApiError('http', `Request failed with status ${status}`, status);
}

function rejectWithApiError(error: unknown): Promise<never> {
    return Promise.reject(toApiError(error));
}

export function createHttpClient(baseURL: string): AxiosInstance {
    const client = axios.create({ baseURL, timeout: REQUEST_TIMEOUT_MS });

    client.interceptors.response.use(undefined, rejectWithApiError);

    return client;
}
