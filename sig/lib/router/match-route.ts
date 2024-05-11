import { RouteConfig } from "./router.type";

export function matchRoute(path: string, routesWithId:  (RouteConfig & { id: string })[], base: string) {
  for (const route of routesWithId) {
    const routeParts = (base + route.path).split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) {
      continue;
    }

    const params = {};

    const partsMatch = routeParts.every((part, index) => {
      if (part.startsWith(':')) {
        params[part.slice(1)] = pathParts[index];
        return true;
      }

      return part === pathParts[index];
    });

    if (partsMatch) {
      return { route, params };
    }
  }

  return null;
}