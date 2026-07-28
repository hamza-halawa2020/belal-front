import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { FeasibilityStudiesApi } from '../../data-access/feasibility-studies.api';
import { FeasibilityStudy } from '../../models/feasibility-study.model';

@Component({
    selector: 'app-feasibility-studies-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
    templateUrl: './feasibility-studies-list.component.html',
    styleUrls: ['./feasibility-studies-list.component.scss']
})
export class FeasibilityStudiesListComponent implements OnInit {
    studies: FeasibilityStudy[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly feasibilityStudiesApi: FeasibilityStudiesApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.feasibilityStudiesApi.getStudies(page).pipe(
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe({
            next: response => {
                this.studies = response.data;
                this.meta = response.meta;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
                this.studies = [];
                this.meta = null;
                this.errorMessage = 'Failed to load feasibility studies.';
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
