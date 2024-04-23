import { appendQueryParams } from './append-query-params';
import { describe, it, expect } from 'vitest';

describe('appendQueryParams', () => {
    it('appends parameters to the query string', () => {
        const url = '/path';
        const params = { query: 'value', anotherQuery: 123 };
        expect(appendQueryParams(url, params)).toBe('/path?query=value&anotherQuery=123');
    });

    it('URL-encodes the parameters', () => {
        const url = '/path';
        const params = { 'query name': 'a b', 'another query': 'c d' };
        expect(appendQueryParams(url, params)).toBe('/path?query+name=a+b&another+query=c+d');
    });

    it('skips parameters that are not strings or numbers', () => {
        const url = '/path';
        const params = { query: 'value', anotherQuery: { subquery: 'value' } };
        expect(appendQueryParams(url, params as any)).toBe('/path?query=value');
    });
});