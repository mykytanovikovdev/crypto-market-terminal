export const STORAGE_KEYS = {
    theme: 'market-terminal:theme',
    locale: 'market-terminal:locale',
    watchlist: 'market-terminal:watchlist',
} as const;

export function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function writeStorage(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage is unavailable in some private modes; preferences then live for the session only.
    }
}
