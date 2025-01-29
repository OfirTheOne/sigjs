export function extractValue(keys: string[], obj: any): any {
    let extractedValue = obj;
    for (const key of keys) {
        if (extractedValue && typeof extractedValue === 'object' && key in extractedValue) {
            extractedValue = extractedValue[key];
        } else {
            return undefined;
        }
    }
    return extractedValue;
}