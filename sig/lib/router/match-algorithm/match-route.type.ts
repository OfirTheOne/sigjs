
export type RouteConfig 
  = ({ path: string; } | { index: boolean; })
  & { children?: RouteConfig[]; }