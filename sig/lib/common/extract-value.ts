export function extractValue(keyOrSelectors: (string | number | symbol | ((o: any) => any))[], obj: any): any {
    let extractedValue = obj;
    for (const keyOrSelector of keyOrSelectors) {

        if (typeof keyOrSelector === 'function') {
            extractedValue = keyOrSelector(extractedValue);
                
        } else if (typeof keyOrSelector === 'string' || typeof keyOrSelector === 'number' || typeof keyOrSelector === 'symbol') {
            const key = keyOrSelector;
            if (extractedValue && typeof extractedValue === 'object' && key in extractedValue) {
                extractedValue = extractedValue[key];
            } else {
                return undefined;
            }
        }
    }
    return extractedValue;
}