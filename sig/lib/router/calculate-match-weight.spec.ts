import { describe, it, expect } from 'vitest';
import { calculateMatchWeight } from './calculate-match-weight';

describe('calculateMatchWeight', () => {
  it('should add 1000 to weight if isMatch is true', () => {
    const weight = calculateMatchWeight([], -1, true);
    expect(weight).toBeGreaterThanOrEqual(10000); 
  });

  it('should have higher weight for lower firstMatchedParamIndex', () => {
    let weightLowerIndex = calculateMatchWeight([], 1, false);
    let weightHigherIndex = calculateMatchWeight([], 2, false);
    expect(weightLowerIndex).toBeGreaterThan(weightHigherIndex);

    weightLowerIndex = calculateMatchWeight([], 1, true);
    weightHigherIndex = calculateMatchWeight([], 2, true);
    expect(weightLowerIndex).toBeGreaterThan(weightHigherIndex);

    weightLowerIndex = calculateMatchWeight(['part1', 'part2'], 1, true);
    weightHigherIndex = calculateMatchWeight(['part01', 'part02'], 2, true);
    expect(weightLowerIndex).toBeGreaterThan(weightHigherIndex);

  });

  it('should increase weight with the number of routeParts', () => {
    const weightFewerParts = calculateMatchWeight(['part1'], -1, false);
    const weightMoreParts = calculateMatchWeight(['part1', 'part2'], -1, false);
    expect(weightMoreParts).toBeGreaterThan(weightFewerParts);
  });

  it('should correctly calculate weight when firstMatchedParamIndex is -1', () => {
    const weight = calculateMatchWeight(['part1'], -1, true);
    // 1000 for isMatch true, and 1 for one routePart
    expect(weight).toEqual(10100);
  });

  it('should correctly calculate weight when firstMatchedParamIndex is 0', () => {
    const weight = calculateMatchWeight(['part1'], 0, true);
    // 1000 for isMatch true, 100 for firstMatchedParamIndex of 0, and 1 for one routePart
    expect(weight).toEqual(10110);
  });


  it('should correctly calculate weight with a combination of parameters', () => {
    const weight = calculateMatchWeight(['part1', 'part2', 'part3'], 1, true);
    // 1000 for isMatch true, -10 for firstMatchedParamIndex of 1, and 3 for routeParts length
    expect(weight).toEqual(10299);
  });
});