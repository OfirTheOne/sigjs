
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