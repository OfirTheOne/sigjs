
import { matchRoutePaths, splitPath } from './nested-match-route'

/**
 * The result of a match
 * @property {boolean} isMatch Whether the path matched the route path
 * @property {Record<string, string>} params The parameters extracted from the path
 * 
 * used in {@link match}
 */
export interface MatchResult {
    isMatch: boolean;
    params?: Record<string, string>;
}


/**
 * Match the given path to the given route path
 * @param {string} toMatch The path to match
 * @param {string} matchTo The route path to match against
 * @returns {MatchResult} The match result
 * 
 * using {@link MatchResult}
 * 
 * @example
 * match('/user/123/profile', '/user/:id/profile') // { isMatch: true, params: { id: '123' } }
 * match('/user/123', '/user') // { isMatch: false }
 * 
 */
export function match(toMatch: string, matchTo: string): MatchResult {
    const toMatchParts = splitPath(toMatch);
    const matchToParts = splitPath(matchTo);
    const { isMatch, params } = matchRoutePaths(toMatchParts, matchToParts);
    return { isMatch, params };
}