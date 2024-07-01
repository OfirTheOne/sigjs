
import type { RouteConfig } from "./match-route.type";

export function buildRootToLeafRouteMatrix<R extends RouteConfig = RouteConfig>(routes: R[]): R[][] {
    const matrix: R[][] = [];
    const buildMatrix = (routes: R[], acc: R[] = []) => {
        for (const route of routes) {
            const newAcc = [...acc, omitKey(route, 'children') as R];
            if (route.children && route.children.length > 0) {
                buildMatrix(route.children as R[], newAcc);
            } else {
                matrix.push(newAcc);
            }
        }
    };
    buildMatrix(routes);
    return matrix;
}
  
function omitKeys<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const clone = { ...obj };
  for (const key of keys) {
    delete clone[key];
  }
  return clone;
}

function omitKey(obj: Record<string, any>, key: string) {
  return omitKeys(obj, [key]);
}