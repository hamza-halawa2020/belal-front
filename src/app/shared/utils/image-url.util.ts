import { environment } from '../../../environments/environment';

export function getStoredImageUrl(imageUrl?: string, image?: string): string {
    if (imageUrl) {
        return imageUrl;
    }

    if (image) {
        return `${environment.imgUrl}storage/${image}`;
    }

    return '';
}
