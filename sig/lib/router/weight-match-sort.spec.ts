import { describe, it, expect } from 'vitest';
import { weightMatchSort } from './weight-match-sort';

describe('weightMatchSort', () => {
  it('should sort routes in descending order of their weights', () => {
    const routes = [
      { routeParts: ['a'], firstMatchedParamIndex: 1, isMatch: true }, // weight = 10000 - 1
      { routeParts: ['b', 'c'], firstMatchedParamIndex: -1, isMatch: false }, // weight = 200
      { routeParts: ['d'], firstMatchedParamIndex: 0, isMatch: true } // weight = 10000 + 100 + 10
    ];
    const sortedRoutes = weightMatchSort([...routes]);
    expect(sortedRoutes[0]).toEqual(routes[2]);
    expect(sortedRoutes[1]).toEqual(routes[0]);
    expect(sortedRoutes[2]).toEqual(routes[1]);
  });

  it('should handle an empty array gracefully', () => {
    const routes = [];
    const sortedRoutes = weightMatchSort([...routes]);
    expect(sortedRoutes).toEqual([]);
  });

  it('should return the same array if it contains a single route', () => {
    const routes = [{ routeParts: ['a'], firstMatchedParamIndex: 0, isMatch: true }];
    const sortedRoutes = weightMatchSort([...routes]);
    expect(sortedRoutes).toEqual(routes);
  });

  it('should correctly sort routes with various weights', () => {
    const routes = [
      { routeParts: ['a', 'b'], firstMatchedParamIndex: 2, isMatch: true }, // 10000 + 200 - 2
      { routeParts: ['c'], firstMatchedParamIndex: -1, isMatch: true }, // 10000 + 100
      { routeParts: ['d', 'e', 'f'], firstMatchedParamIndex: 1, isMatch: false } // 300 - 1
    ];
    const sortedRoutes = weightMatchSort([...routes]);
    expect(sortedRoutes[0]).toEqual(routes[0]);
    expect(sortedRoutes[1]).toEqual(routes[1]);
    expect(sortedRoutes[2]).toEqual(routes[2]);
  });
});