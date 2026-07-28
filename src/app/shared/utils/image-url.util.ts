import { environment } from '../../../environments/environment';

export function getStoredImageUrl(imageUrl?: string, image?: string): string {
    const normalizedImageUrl = normalizeImageUrl(imageUrl);

    if (normalizedImageUrl) {
        return normalizedImageUrl;
    }

    return normalizeImageUrl(image);
}

function normalizeImageUrl(image?: string): string {
    if (!image) {
        return '';
    }

    const trimmedImage = image.trim();
    const nestedAbsoluteUrl = trimmedImage.match(/\/storage\/(https?:\/\/.+)$/i)?.[1];

    if (nestedAbsoluteUrl) {
        return nestedAbsoluteUrl;
    }

    if (isAbsoluteUrl(trimmedImage) || trimmedImage.startsWith('/assets/') || trimmedImage.startsWith('assets/')) {
        return trimmedImage;
    }

    const imagePath = trimmedImage.replace(/^\/?storage\/?/, '').replace(/^\/+/, '');
    const assetBaseUrl = getAssetBaseUrl();

    return `${assetBaseUrl}storage/${imagePath}`;
}

function isAbsoluteUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
}

function getAssetBaseUrl(): string {
    if (environment.imgUrl) {
        return ensureTrailingSlash(environment.imgUrl);
    }

    return ensureTrailingSlash(environment.backEndUrl.replace(/\/api\/?$/, ''));
}

function ensureTrailingSlash(url: string): string {
    return url.endsWith('/') ? url : `${url}/`;
}
