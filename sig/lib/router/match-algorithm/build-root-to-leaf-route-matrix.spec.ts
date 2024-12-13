
import { buildRootToLeafRouteMatrix } from './build-root-to-leaf-route-matrix';
import { describe, it, expect } from 'vitest'
import { RouteConfig } from './match-route.type';

describe('buildRootToLeafRouteMatrix', () => {
  it('should correctly build a matrix from root node to all the leaf nodes', () => {
    const input: RouteConfig[] = [
      {
        path: "/",
        children: [
          {
            path: "contact",
          },
          {
            path: "dashboard",
            children: [
              {
                path: ":board",
                children: [
                  {
                    path: "overview",
                  }
                ]
              },
              {
                path: "main",
                children: [
                  {
                    path: "overview",
                  },
                ],
              },
              {
                path: "foo",
              }
            ]
          }
        ]
      }
    ];

    const expectedOutput = [
      [ { path: "/" }, { path: "contact" } ],
      [ { path: "/" }, { path: "dashboard" }, { path: ":board" }, { path: "overview" } ],
      [ { path: "/" }, { path: "dashboard" }, { path: "main" }, { path: "overview" } ],
      [ { path: "/" }, { path: "dashboard" }, { path: "foo" } ]
    ];

    const result = buildRootToLeafRouteMatrix(input);
    expect(result).toEqual(expectedOutput);
  });
});