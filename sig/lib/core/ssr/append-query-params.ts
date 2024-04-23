export function appendQueryParams(url: string, params: Record<string, string | number>): string {
    try {
        const urlObj = new URL(url, 'http://dummy.com');
        for (const key in params) {
            if (typeof params[key] === 'string' || typeof params[key] === 'number') {
              urlObj.searchParams.append(key, params[key].toString());
            }
          }

        return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (error) {
        console.error(`Failed to append query parameters: ${error}`);
        return url;
    }
}