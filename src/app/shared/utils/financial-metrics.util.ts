export interface FinancialMetricItem {
    label: string;
    value: string;
}

export function parseFinancialMetrics(metrics?: string): FinancialMetricItem[] {
    if (!metrics) {
        return [];
    }

    try {
        const parsed: unknown = JSON.parse(metrics);

        if (!isPlainRecord(parsed)) {
            return [];
        }

        return Object.entries(parsed)
            .filter((entry): entry is [string, string | number | boolean] => isMetricValue(entry[1]))
            .map(([label, value]) => ({
                label,
                value: String(value)
            }));
    } catch {
        return [];
    }
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isMetricValue(value: unknown): value is string | number | boolean {
    return ['string', 'number', 'boolean'].includes(typeof value);
}
