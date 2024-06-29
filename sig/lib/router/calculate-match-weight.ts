
export function calculateMatchWeight(
    routeParts: string[],
    firstMatchedParamIndex: number,
    isMatch: boolean,
) {
    let weight = 0;
    // isMatch should have higher weight
    if (isMatch) {
        weight += 10000;
    }

    weight += routeParts.length * 100;

    // smaller firstMatchedParamIndex should have higher weight
    if (firstMatchedParamIndex != -1) {
        if(firstMatchedParamIndex == 0) {
            weight += 10;
        } else {
            weight -= firstMatchedParamIndex;
        }
        // weight = firstMatchedParamIndex ? 
        //     weight - firstMatchedParamIndex * 10 : weight + 10;
    }
    // larger routeParts.length should have higher weight
    return weight;
}