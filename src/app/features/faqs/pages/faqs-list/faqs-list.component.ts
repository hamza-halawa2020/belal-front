import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { FaqsApi } from '../../data-access/faqs.api';
import { Faq } from '../../models/faq.model';

@Component({
    selector: 'app-faqs-list',
    standalone: true,
    imports: [CommonModule, NgbModule, TranslateModule, PaginationComponent],
    templateUrl: './faqs-list.component.html',
    styleUrls: ['./faqs-list.component.scss']
})
export class FaqsListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    faqs: Faq[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly faqsApi: FaqsApi,
        public readonly translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.faqsApi.getFaqs(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.faqs = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.faqs = [];
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
}
