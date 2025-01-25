import { describe, it, expect } from 'vitest'
import { matchRoute, matchRoutePaths } from './nested-match-route';
import { RouteConfig } from './match-route.type';

describe('matchRoute', () => {
  function routeOmitChildren(route?: RouteConfig) {
    if (!route) {
      return null;
    }
    const { children, ...routeWithoutChildren } = route;
    return routeWithoutChildren;
  }

  describe('matchRoute with complex routing' , () => {
    const routesConfig = [
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
                  }
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

    it('should match root route', () => {
      const { routes, params } = matchRoute('/', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0])
      ]);
    });

    it('should match contact route', () => {
      const { routes, params } = matchRoute('/contact', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[0]),
      ]);
    });

    it('should match dashboard route with parameter', () => {
      const { routes, params } = matchRoute('/dashboard/123', routesConfig);
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[1]),
        routeOmitChildren(routesConfig[0].children[1].children?.[0]),
      ]);
      expect(params).toStrictEqual({ board: '123' });

    });

    it('should match dashboard route with parameter and overview router after', () => {
      const { routes, params } = matchRoute('/dashboard/123/overview', routesConfig);
      expect(params).toStrictEqual({ board: '123' });
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[1]),
        routeOmitChildren(routesConfig[0].children[1].children?.[0]),
        routeOmitChildren(routesConfig[0].children[1].children?.[0]?.children?.[0]),
      ]);
    });

    it('should match dashboard main route', () => {
      const { routes, params } = matchRoute('/dashboard/main', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[1]),
        routeOmitChildren(routesConfig[0].children[1].children?.[1]),
      ]);
    });


    it('should match dashboard foo route', () => {
      const { routes, params } = matchRoute('/dashboard/foo', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[1]),
        routeOmitChildren(routesConfig[0].children[1].children?.[2]),
      ]);
    });

    it('should match dashboard main route', () => {
      const { routes, params } = matchRoute('/dashboard/main/overview', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[1]),
        routeOmitChildren(routesConfig[0].children[1]?.children?.[1]),
        routeOmitChildren(routesConfig[0].children[1]?.children?.[1]?.children?.[0])
      ]);
    });

    it('should return null for non-matching route', () => {
      const { routes, params } = matchRoute('/nonexistent', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0])
      ]);
    });
  });
  
  describe('matchRoute with flat route ', () => {
    const routesConfig = [
      {
        path: "/",
      },
      {
        path: "/contact",
      },
      {
        path: "/dashboard/:board",
      },
      {
        path: "/dashboard",
      },
    ];
  
    it('should match root route', () => {
      const { routes, params } = matchRoute('/', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0])
      ]);
    });
  
    it('should match contact route', () => {
      const { routes, params } = matchRoute('/contact', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[1])
      ]);
    });
  
    it('should match dashboard route', () => {
      const { routes, params } = matchRoute('/dashboard', routesConfig);
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[3])
      ]);
      expect(params).toStrictEqual({});
    });
  
    it('should match dashboard route with parameter', () => {
      const { routes, params } = matchRoute('/dashboard/123', routesConfig);
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[2])
      ]);
      expect(params).toStrictEqual({ board: '123' });
    });
  
  });
  
  describe('matchRoute with two routes with same resolved path', () => {
    const routesConfig = [
      {
        path: "/",
        children: [
          {
            path: "contact",
            children: [
              {
                path: 'overview'
              }
            ]
          },
          {
            path: "contact/overview",
          }
        ]
      }
    ];
  
    it('should match contact route', () => {
      const { routes, params } = matchRoute('/contact/overview', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[0]),
        routeOmitChildren(routesConfig[0].children?.[0]?.children?.[0])
      ]);
    });
  
  });
  
  describe('matchRoute with "*" route', () => {
    const routesConfig = [
      { path: '/',
        children: [
          {
            path: 'contact',
            children: [
              { path: 'overview' },
              { path: ':id' }
            ]
          },
          { path: '*' },
        ]
      }
    ];
  
    it('should match contact route', () => {
      const { routes, params } = matchRoute('/contact', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[0]),
      ]);
    });
  
    it('should match contact route with overview', () => {
      const { routes, params } = matchRoute('/contact/overview', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[0]),
        routeOmitChildren(routesConfig[0].children[0].children?.[0])
      ]);
    });
  
    it('should match contact route with id', () => {
      const { routes, params } = matchRoute('/contact/123', routesConfig);
      expect(params).toStrictEqual({ id: '123' });
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[0]),
        routeOmitChildren(routesConfig[0].children[0].children?.[1])
      ]);
    });
  
    it('should match "*" route', () => {
      const { routes, params } = matchRoute('/nonexistent', routesConfig);
      expect(params).toStrictEqual({});
      expect(routes).toStrictEqual([
        routeOmitChildren(routesConfig[0]),
        routeOmitChildren(routesConfig[0].children[1])
      ]);
    });
        
  });

});

describe('matchRoutePaths', () => {

    it('should match paths', () => {
      const { isMatch, params } = matchRoutePaths(['contact'], ['contact']);
      expect(isMatch).toBe(true);
      expect(params).toStrictEqual({});
    });

    it('should match paths with parameter', () => {
      const { isMatch, params } = matchRoutePaths(['contact', ':id'], ['contact', '123']);
      expect(isMatch).toBe(true);
      expect(params).toStrictEqual({ id: '123' });
    });

    it('should match paths with multiple parameters', () => {
      const { isMatch, params } = matchRoutePaths(['contact', ':id', 'overview'], ['contact', '123', 'overview']);
      expect(isMatch).toBe(true);
      expect(params).toStrictEqual({ id: '123' });
    });

    it('should not match paths where route contained the path and more parts', () => {
      const { isMatch, params } = matchRoutePaths(['contact', 'overview'], ['contact']);
      expect(isMatch).toBe(false);
      expect(params).toStrictEqual({});
    });

});