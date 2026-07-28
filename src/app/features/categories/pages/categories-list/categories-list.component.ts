import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { CategoriesApi } from '../../data-access/categories.api';
import { Category } from '../../models/category.model';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ImageFallbackDirective],
    templateUrl: './categories-list.component.html',
    styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    categories: Category[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly categoriesApi: CategoriesApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.categoriesApi.getCategories(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.categories = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.categories = [];
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

    getImageUrl(category: Category): string {
        return getStoredImageUrl(category.image_url, category.image);
    }
}
