
import { matchRoutePaths, splitPath } from './nested-match-route'
export interface MatchResult {
    isMatch: boolean;
    params?: Record<string, string>;
}


/** @publicApi **/
export function match(toMatch: string, matchTo: string): MatchResult {
    const toMatchParts = splitPath(toMatch);
    const matchToParts = splitPath(matchTo);
    const { isMatch, params } = matchRoutePaths(toMatchParts, matchToParts);
    return { isMatch, params };
}