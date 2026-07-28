import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { CategoriesApi } from '../../data-access/categories.api';
import { Category } from '../../models/category.model';

@Component({
    selector: 'app-category-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, ContentCardComponent],
    templateUrl: './category-details.component.html',
    styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    category: Category | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly categoriesApi: CategoriesApi
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => Boolean(id)),
            switchMap(id => {
                this.isLoading = true;
                this.errorMessage = '';

                return this.categoriesApi.getCategory(id).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.category = response.data;
            },
            error: () => {
                this.category = null;
                this.errorMessage = 'Failed to load category details.';
            }
        });
    }

    getImageUrl(category: Category): string {
        return getStoredImageUrl(category.image_url, category.image);
    }
}
