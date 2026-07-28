import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
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
            })
        ).subscribe({
            next: response => {
                this.reviews = response.data;
                this.meta = response.meta;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
                this.reviews = [];
                this.meta = null;
                this.errorMessage = 'Failed to load reviews.';
            }
        });
    }

    onPageChange(page: number): void {
        if (!this.meta || page < 1 || page > this.meta.last_page || page === this.meta.current_page) {
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
