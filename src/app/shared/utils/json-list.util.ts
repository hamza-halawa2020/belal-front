export function parseJsonStringList(value?: string): string[] {
    if (!value) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
    } catch {
        return [];
    }
}
