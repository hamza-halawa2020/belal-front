export interface CategoryStudy {
    id: number;
    title: string;
    description?: string;
    image?: string;
    image_url?: string;
}

export interface Category {
    id: number;
    title: string;
    image?: string;
    image_url?: string;
    feasibility_studies?: CategoryStudy[];
    created_at?: string;
    updated_at?: string;
}
