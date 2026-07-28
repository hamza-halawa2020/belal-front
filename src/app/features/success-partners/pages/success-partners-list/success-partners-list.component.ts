import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
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
                this.errorMessage = 'Failed to load partners.';
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
        if (!link) {
            return;
        }

        const url = link.startsWith('http') ? link : `https://${link}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}
