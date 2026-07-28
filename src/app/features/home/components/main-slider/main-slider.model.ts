export interface MainSliderItem {
    id: number;
    title?: string;
    description?: string;
    image_url: string;
    link?: string | null;
}

export interface MainSliderResponse {
    data?: MainSliderItem[];
}
