
import { buildRootToLeafRouteMatrix } from "./build-root-to-leaf-route-matrix";
import { RouteConfig } from "./match-route.type";


export interface MatchRouteResult<R extends RouteConfig = RouteConfig> {
  routes: R[];
  params: Record<string, string>;
}

export interface MatchedRoute<R extends RouteConfig = RouteConfig> {
  route: R;
  params: Record<string, string>;
  routeParts: string[],
  firstMatchedParamIndex: number

  children: MatchedRoute<R>[];
}

/* 
export function matchRouteVertical<R extends RouteConfig = RouteConfig>(path: string, routes: R[], basePath = ''): MatchRouteResult<R> {
  
  function matchRouteRecursive(innerPath: string, innerRoutes: RouteConfig[], innerBasePath = ''): MatchedRoute<RouteConfig>[] {
    const matched: MatchedRoute<RouteConfig>[] = [];
    const pathParts = innerPath == '/' ? [''] : innerPath.split('/');
    let processedRoutes = innerRoutes.map((route) => {
      const fullPath = innerBasePath + route.path;
      const routeParts = fullPath == '/' ? [''] : fullPath.split('/');
      const matchParams: Record<string, string> = {};
      let firstMatchedParamIndex = -1;
      const isMatch = routeParts.every((part, index) => {
        if (part.startsWith(':')) {
          if (pathParts.length <= index) {
            return false;
          }
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

    processedRoutes = weightMatchSort(processedRoutes);

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
            firstMatchedParamIndex,
            children: []
          });
        } else {
          const { children, ...routeOmitChildren } = route;
          const remainingPath = pathParts.slice(routeParts.length).join('/');
          const childMatch = matchRouteRecursive(remainingPath, children, '');
        
          if (childMatch) {
            const currentMatch: MatchedRoute<RouteConfig> = { 
              route: routeOmitChildren, 
              params: matchParams,
              firstMatchedParamIndex,
              routeParts,
              children: childMatch
            };
            matched.push(currentMatch);
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
  const flatMatchedRoutes = flattenRoutesNoRecursion(matchedRoutesUnprocessed);
  const pickedMatchedRoutesUnprocessed = flatMatchedRoutes.map(({ route, params }) => ({route, params}));
  const combinedParams: Record<string, string> = {};
  const matchedRoutes = pickedMatchedRoutesUnprocessed.map(({ route, params }) => {
    Object.assign(combinedParams, params);
    return route;
  });

  return { routes: matchedRoutes as R[], params: combinedParams };
}

function flattenRoutesNoRecursion(routes: MatchedRoute[]) {
  const flatRoutes: MatchedRoute<RouteConfig>[] = [];
  const stack = [...routes];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    flatRoutes.push(current);
    stack.push(...current.children);
  }
  return flatRoutes;
}   

*/

export function matchRoute<R extends RouteConfig = RouteConfig>(path: string, routes: R[]): MatchRouteResult<R> {

  const rootToLeafMatrix = buildRootToLeafRouteMatrix(routes);
  const pathParts = splitPath(path);
  const processedMatchedRoutes: {
      routeParts: { 
        route: R; 
        fullPath: string; 
        routePathParts: string[]; 
      }[];
      firstMatchedParamIndex: number; 
      matchParams: Record<string, string>; 
  }[] = [];

  for(const pathRootToLeaf of rootToLeafMatrix) {
    let fullPathToCurrentRoutePart = '/';
    let firstMatchedParamIndex = -1;
    const matchParams: Record<string, string> = {};
    const processedRouteParts: { 
      route: R; 
      fullPath: string; 
      routePathParts: string[]; 
    }[] = [];
    for(const routePart of pathRootToLeaf) {
      fullPathToCurrentRoutePart = resolvePath(fullPathToCurrentRoutePart, routePart.path);
      const routePathParts = splitPath(fullPathToCurrentRoutePart); //  == '/' ? [''] : fullPathToCurrentRoutePart.split('/');
      const isMatch = routePathParts.every((part, index) => {
        if (part.startsWith(':')) {
          if (pathParts.length <= index) {
            return false;
          }
          if (firstMatchedParamIndex === -1) {
            firstMatchedParamIndex = index;
          }
          matchParams[part.slice(1)] = pathParts[index];
          return true;
        }
        return part === pathParts[index];
      });
      if(isMatch) {
        processedRouteParts.push({
          route: routePart,
          fullPath: fullPathToCurrentRoutePart,
          routePathParts,
        });
      } else {
        break;
      }
    }

    if(processedRouteParts.length) {
      processedMatchedRoutes.push({
        routeParts: processedRouteParts,
        firstMatchedParamIndex,
        matchParams,
      });
    }
  }


  const postProcessedMatchedRoutes = processedMatchedRoutes.map(({ 
    routeParts, 
    firstMatchedParamIndex, 
    matchParams 
  }) => {
    const mostSpecificRoute = routeParts.at(-1);
    const overallRouteParts =  splitPath(mostSpecificRoute?.fullPath); // === '/' ? [''] : mostSpecificRoute?.fullPath.split('/') || [];
    const depth = overallRouteParts.length;
    const isFullMatch = depth === pathParts.length;
    const isExactMatch = firstMatchedParamIndex === -1 && isFullMatch;
    
    return {
      params: matchParams,
      routeParts,
      firstMatchedParamIndex,
      depth,
      isFullMatch,
      isExactMatch,
    };
  });

  const exactMatch = postProcessedMatchedRoutes.find(({ isExactMatch }) => isExactMatch);
  if(exactMatch) {
    return { 
      routes: exactMatch.routeParts.map(({ route }) => route), 
      params: exactMatch.params 
    };
  }

  const fullMatches = postProcessedMatchedRoutes.find(({ isFullMatch }) => isFullMatch);
  if(fullMatches) {
    return { 
      routes: fullMatches.routeParts.map(({ route }) => route), 
      params: fullMatches.params 
    };
  }

  const mostDepthMatch = postProcessedMatchedRoutes.reduce((acc, curr) => acc.depth > curr.depth ? acc : curr);
  return { 
    routes: mostDepthMatch.routeParts.map(({ route }) => route), 
    params: mostDepthMatch.params 
  };
}


function resolvePath(...pathParts: string[]): string {
  const trimmedSlashPathParts = pathParts.map((part) => part.replace(/^\/|\/$/g, ''));
  const joinedPath = trimmedSlashPathParts
    .filter((part) => part.length > 0)
    .join('/');
  return `/${joinedPath}`;
}


function splitPath(path?: string): string[] {
  if (path === undefined) {
    return [];
  }
  return path == '/' ? [''] : path.split('/');
}