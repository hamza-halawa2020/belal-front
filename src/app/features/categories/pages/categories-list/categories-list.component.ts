import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { CategoriesApi } from '../../data-access/categories.api';
import { Category } from '../../models/category.model';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent],
    templateUrl: './categories-list.component.html',
    styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
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
            })
        ).subscribe({
            next: response => {
                this.categories = response.data;
                this.meta = response.meta;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
                this.categories = [];
                this.meta = null;
                this.errorMessage = 'Failed to load categories.';
            }
        });
    }

    onPageChange(page: number): void {
        if (!this.meta || page < 1 || page > this.meta.last_page || page === this.meta.current_page) {
            return;
        }

        this.loadPage(page);
    }
}
