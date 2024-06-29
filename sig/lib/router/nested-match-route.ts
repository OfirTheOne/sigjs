
import { weightMatchSort } from "./weight-match-sort";

export interface RouteConfig {
  path: string;
  children?: RouteConfig[];
}

export interface MatchRouteResult<R extends RouteConfig = RouteConfig> {
  routes: R[];
  params: Record<string, string>;
}

export interface MatchedRoute<R extends RouteConfig = RouteConfig> {
  route: R;
  params: Record<string, string>;
  routeParts: string[],
  firstMatchedParamIndex: number
}

export function matchRoute<R extends RouteConfig = RouteConfig>(path: string, routes: R[], basePath = ''): MatchRouteResult<R> {
  
  function matchRouteRecursive(innerPath: string, innerRoutes: RouteConfig[], innerBasePath = ''): MatchedRoute<RouteConfig>[] {
    const matched: MatchedRoute<RouteConfig>[] = [];
    const pathParts = innerPath == '/' ? [''] : innerPath.split('/');
    const processedRoutes = innerRoutes.map((route) => {
      const fullPath = innerBasePath + route.path;
      const routeParts = fullPath == '/' ? [''] : fullPath.split('/');
      const matchParams: Record<string, string> = {};
      let firstMatchedParamIndex = -1;
      const isMatch = routeParts.every((part, index) => {
        if (part.startsWith(':')) {
          if (firstMatchedParamIndex === -1) {
            firstMatchedParamIndex = index;
          }
          matchParams[part.slice(1)] = pathParts[index];
          return true;
        }
        return part === pathParts[index];
      });
      return {
        route,
        fullPath,
        routeParts,
        matchParams,
        firstMatchedParamIndex,
        isMatch
      };
    });

    weightMatchSort(processedRoutes);

    for (const { 
      route, 
      routeParts, 
      firstMatchedParamIndex, 
      isMatch, 
      matchParams
    } of processedRoutes) {
      if (isMatch) {

        // If the route has no children
        // or the path has no more parts
        if (
          (routeParts.length === pathParts.length) ||
          !(route.children && route.children.length > 0)
        ) {
          const { children, ...routeOmitChildren } = route;
          matched.push({ 
            route: routeOmitChildren, 
            params: matchParams,
            routeParts,
            firstMatchedParamIndex 
          });
        } else {
          const { children, ...routeOmitChildren } = route;
          const remainingPath = pathParts.slice(routeParts.length).join('/');
          const childMatch = matchRouteRecursive(remainingPath, children, '');
         
          if (childMatch) {
            return [
              { 
                route: routeOmitChildren, 
                params: matchParams,
                firstMatchedParamIndex,
                routeParts
              }, 
              ...childMatch
            ];
          }
        }
      }
    }

    // no matches
    if (matched.length == 0) {
      return [];
    }

    // has matches
    const sortedMatched = weightMatchSort(matched.map((match) => ({ ...match, isMatch: true })));
    const bestMatch = sortedMatched?.[0];
    // const exactMatch = matched.find((match) => match.firstMatchedParamIndex === -1);
    // const bestMatch = matched.reduce((acc, curr) =>{

    //   return (acc.firstMatchedParamIndex < curr.firstMatchedParamIndex) ? curr : acc
    // });
    // const route = bestMatch ? { 
    //   params: bestMatch.params, 
    //   route: bestMatch.route
    // } : null;

    return bestMatch ? [bestMatch] : [];
  }

  const matchedRoutesUnprocessed = matchRouteRecursive(path, routes, basePath);
  const pickedMatchedRoutesUnprocessed = matchedRoutesUnprocessed.map(({ route, params }) => ({route, params}));
  const combinedParams: Record<string, string> = {};
  const matchedRoutes = pickedMatchedRoutesUnprocessed.map(({ route, params }) => {
    Object.assign(combinedParams, params);
    return route;
  });

  return { routes: matchedRoutes as R[], params: combinedParams };
}

