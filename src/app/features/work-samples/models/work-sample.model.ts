export interface WorkSample {
    id: number;
    title: string;
    description?: string;
    image?: string;
    image_url?: string;
    money_capital?: string | number;
    rate_of_return?: string | number;
    status?: number;
    services?: string;
    study_content?: string;
    financial_metrics?: string;
    created_at?: string;
    updated_at?: string;
}
