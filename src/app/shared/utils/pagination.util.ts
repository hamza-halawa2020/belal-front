import { PaginationMeta } from '../../core/api/api.types';

export function canLoadPage(meta: PaginationMeta | null, page: number): boolean {
    return Boolean(meta && page >= 1 && page <= meta.last_page && page !== meta.current_page);
}

export function scrollToPageTop(): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
