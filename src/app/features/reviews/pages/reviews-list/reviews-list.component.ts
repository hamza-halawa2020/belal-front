import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { ReviewsApi } from '../../data-access/reviews.api';
import { Review } from '../../models/review.model';

@Component({
    selector: 'app-reviews-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent],
    templateUrl: './reviews-list.component.html',
    styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    reviews: Review[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly reviewsApi: ReviewsApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.reviewsApi.getReviews(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.reviews = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.reviews = [];
                this.meta = null;
                this.errorMessage = 'Failed to load reviews.';
            }
        });
    }

    onPageChange(page: number): void {
        if (!canLoadPage(this.meta, page)) {
            return;
        }

        this.loadPage(page);
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    getInitials(name: string): string {
        return name
            .split(' ')
            .filter(Boolean)
            .map(part => part[0])
            .join('')
            .toUpperCase();
    }
}
