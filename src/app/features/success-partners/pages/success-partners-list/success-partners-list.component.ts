import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { SuccessPartnersApi } from '../../data-access/success-partners.api';
import { SuccessPartner } from '../../models/success-partner.model';

@Component({
    selector: 'app-success-partners-list',
    standalone: true,
    imports: [CommonModule, TranslateModule, PaginationComponent, ImageFallbackDirective],
    templateUrl: './success-partners-list.component.html',
    styleUrls: ['./success-partners-list.component.scss']
})
export class SuccessPartnersListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly logoImageFallback = 'assets/images/logo.svg';

    partners: SuccessPartner[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly successPartnersApi: SuccessPartnersApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.successPartnersApi.getPartners(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.partners = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.partners = [];
                this.meta = null;
                this.errorMessage = 'UNEXPECTED_ERROR';
            }
        });
    }

    onPageChange(page: number): void {
        if (!canLoadPage(this.meta, page)) {
            return;
        }

        this.loadPage(page);
    }

    openPartnerLink(link?: string | null): void {
        if (!this.isBrowser || !link) {
            return;
        }

        const url = link.startsWith('http') ? link : `https://${link}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    getImageUrl(partner: SuccessPartner): string {
        return getStoredImageUrl(partner.image_url) || this.logoImageFallback;
    }
}
