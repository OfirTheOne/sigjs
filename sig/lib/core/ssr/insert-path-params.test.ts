import { insertPathParams } from './insert-path-params';
import { describe, it, expect } from 'vitest';
describe('insertPathParams', () => {
    it('replaces placeholders in the path', () => {
        const url = '/users/:userId/posts/:postId';
        const params = { userId: 123, postId: 456 };
        expect(insertPathParams(url, params)).toBe('/users/123/posts/456');
    });

    it('leaves placeholders in the path if not provided in params', () => {
        const url = '/users/:userId/posts/:postId';
        const params = { userId: 123 };
        expect(insertPathParams(url, params)).toBe('/users/123/posts/:postId');
    });

    it('does not replace placeholders that are part of a larger segment', () => {
        const url = '/users/:userIdSuffix/posts/:postId';
        const params = { userId: 123, postId: 456 };
        expect(insertPathParams(url, params)).toBe('/users/:userIdSuffix/posts/456');
    });

    it('does not replace placeholders in the query string or fragment identifier', () => {
        const url = '/users/:userId/posts/:postId?query=:query#fragment=:fragment';
        const params = { userId: 123, postId: 456, query: 'value', fragment: 'value' };
        expect(insertPathParams(url, params)).toBe('/users/123/posts/456?query=:query#fragment=:fragment');
    });

    it('URL-encodes the parameters', () => {
        const url = '/users/:userId/posts/:postId';
        const params = { userId: 'a b', postId: 'c d' };
        expect(insertPathParams(url, params)).toBe('/users/a%20b/posts/c%20d');
    });
});