import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';
import { ApiError, toApiError } from '@/api/http';

function createAxiosErrorWithStatus(status: number): AxiosError {
    const config = { headers: new AxiosHeaders() };
    const response = { status, data: null, headers: {}, config, statusText: '' } as AxiosResponse;

    return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', config, null, response);
}

describe('toApiError', () => {
    it('maps HTTP 429 to a rate limit error', () => {
        const error = toApiError(createAxiosErrorWithStatus(429));

        expect(error.kind).toBe('rateLimited');
        expect(error.status).toBe(429);
    });

    it('maps other HTTP statuses to a generic http error', () => {
        const error = toApiError(createAxiosErrorWithStatus(503));

        expect(error.kind).toBe('http');
        expect(error.status).toBe(503);
    });

    it('maps a request without a response to a network error', () => {
        const error = toApiError(new AxiosError('Network Error', 'ERR_NETWORK'));

        expect(error.kind).toBe('network');
        expect(error.status).toBeNull();
    });

    it('maps non-axios errors to an unknown error', () => {
        expect(toApiError(new Error('boom')).kind).toBe('unknown');
    });

    it('returns an existing ApiError unchanged', () => {
        const apiError = new ApiError('network', 'offline');

        expect(toApiError(apiError)).toBe(apiError);
    });
});
