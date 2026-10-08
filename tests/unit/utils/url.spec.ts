import { describe, expect, it } from 'vitest';
import { isSafeHttpUrl } from '@/utils/url';

describe('isSafeHttpUrl', () => {
    it('accepts http and https links', () => {
        expect(isSafeHttpUrl('https://bitcoin.org')).toBe(true);
        expect(isSafeHttpUrl('http://example.com/path')).toBe(true);
    });

    it('rejects empty values, script URLs and malformed strings', () => {
        expect(isSafeHttpUrl('')).toBe(false);
        expect(isSafeHttpUrl(null)).toBe(false);
        expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
        expect(isSafeHttpUrl('data:text/html,<script>')).toBe(false);
        expect(isSafeHttpUrl('not a url')).toBe(false);
    });
});
