export interface FeasibilityStudyCategory {
    id: number;
    title: string;
}

export interface FeasibilityStudy {
    id: number;
    title: string;
    description?: string;
    image?: string;
    image_url?: string;
    services?: string;
    study_content?: string;
    financial_metrics?: string;
    money_capital?: string | number;
    rate_of_return?: string | number;
    category?: FeasibilityStudyCategory;
    created_at?: string;
    updated_at?: string;
}
