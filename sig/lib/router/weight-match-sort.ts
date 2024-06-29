import { calculateMatchWeight } from "./calculate-match-weight";


export function weightMatchSort<R extends {
  routeParts: string[];
  firstMatchedParamIndex: number;
  isMatch: boolean;
}>(routes: R[]) {
  return [...routes].sort((a, b) => {
    const weightA = calculateMatchWeight(a.routeParts, a.firstMatchedParamIndex, a.isMatch);
    const weightB = calculateMatchWeight(b.routeParts, b.firstMatchedParamIndex, b.isMatch);
    return weightB - weightA;
  });
}