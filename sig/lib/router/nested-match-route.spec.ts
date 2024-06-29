import { describe, it, expect } from 'vitest'
import { matchRoute, RouteConfig } from './nested-match-route';

describe.skip('matchRoute', () => {
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
    const {routes, params } = matchRoute('/', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0])
    ]);
  });

  it('should match contact route', () => {
    const {routes, params } = matchRoute('/contact', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0]),
      routeOmitChildren(routesConfig[0].children[0]),
    ]);
  });

  it('should match dashboard route with parameter', () => {
    const {routes, params } = matchRoute('/dashboard/123', routesConfig);
    expect(params).toStrictEqual({ board: '123' });
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0]),
      routeOmitChildren(routesConfig[0].children[1]),
      routeOmitChildren(routesConfig[0].children[1].children?.[0]),
    ]);
  });

  it('should match dashboard route with parameter and overview router after', () => {
    const {routes, params } = matchRoute('/dashboard/123/overview', routesConfig);
    expect(params).toStrictEqual({ board: '123' });
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0]),
      routeOmitChildren(routesConfig[0].children[1]),
      routeOmitChildren(routesConfig[0].children[1].children?.[0]),
      routeOmitChildren(routesConfig[0].children[1].children?.[0]?.children?.[0]),
    ]);
  });

  it('should match dashboard main route', () => {
    const {routes, params } = matchRoute('/dashboard/main', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0]),
      routeOmitChildren(routesConfig[0].children[1]),
      routeOmitChildren(routesConfig[0].children[1].children?.[1]),
    ]);
  });


  it('should match dashboard foo route', () => {
    const {routes, params } = matchRoute('/dashboard/foo', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0]),
      routeOmitChildren(routesConfig[0].children[1]),
      routeOmitChildren(routesConfig[0].children[1].children?.[2]),
    ]);
  });

  it('should match dashboard main route', () => {
    const {routes, params } = matchRoute('/dashboard/main/overview', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0]),
      routeOmitChildren(routesConfig[0].children[1]),
      routeOmitChildren(routesConfig[0].children[1]?.children?.[1]),
      routeOmitChildren(routesConfig[0].children[1]?.children?.[1]?.children?.[0])
    ]);
  });

  it('should return null for non-matching route', () => {
    const {routes, params } = matchRoute('/nonexistent', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0])
    ]);
  });
});

function routeOmitChildren(route?: RouteConfig) {
  if (!route) {
    return null;
  } 
  const { children, ...routeWithoutChildren } = route;
  return routeWithoutChildren;
}

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
    const {routes, params } = matchRoute('/', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[0])
    ]);
  });

  it('should match contact route', () => {
    const {routes, params } = matchRoute('/contact', routesConfig);
    expect(params).toStrictEqual({});
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[1])
    ]);
  } );

  it.only('should match dashboard route', () => {
    const {routes, params } = matchRoute('/dashboard', routesConfig);
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[3])
    ]);
    expect(params).toStrictEqual({});
  });

  it('should match dashboard route with parameter', () => {
    const {routes, params } = matchRoute('/dashboard/123', routesConfig);
    expect(routes).toStrictEqual([
      routeOmitChildren(routesConfig[2])
    ]);
    expect(params).toStrictEqual({ board: '123' });
  });

});

