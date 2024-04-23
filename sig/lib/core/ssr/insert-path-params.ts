export function insertPathParams(url: string, params: Record<string, string | number>): string {
    let result = url;

    // Extract the path, query, and fragment from the URL
    const urlObj = new URL(url, 'http://dummy.com');
    let { pathname } = urlObj;
    const { search, hash } = urlObj;

    // Replace placeholders in the path
    for (const key in params) {
        const regex = new RegExp(`:${key}(?=[/\\?#]|$)`, 'g');
        pathname = pathname.replace(regex, encodeURIComponent(params[key].toString()));
    }

    // Construct the new URL
    result = pathname + search + hash;

    return result;
}