import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { InvestmentOpportunitiesApi } from '../../data-access/investment-opportunities.api';
import { InvestmentOpportunity } from '../../models/investment-opportunity.model';

@Component({
    selector: 'app-investment-opportunities-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
    templateUrl: './investment-opportunities-list.component.html',
    styleUrls: ['./investment-opportunities-list.component.scss']
})
export class InvestmentOpportunitiesListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    opportunities: InvestmentOpportunity[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly investmentOpportunitiesApi: InvestmentOpportunitiesApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.investmentOpportunitiesApi.getOpportunities(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.opportunities = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.opportunities = [];
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
