import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { WorkSamplesApi } from '../../data-access/work-samples.api';
import { WorkSample } from '../../models/work-sample.model';

@Component({
    selector: 'app-work-samples-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
    templateUrl: './work-samples-list.component.html',
    styleUrls: ['./work-samples-list.component.scss']
})
export class WorkSamplesListComponent implements OnInit {
    workSamples: WorkSample[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly workSamplesApi: WorkSamplesApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.workSamplesApi.getWorkSamples(page).pipe(
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe({
            next: response => {
                this.workSamples = response.data;
                this.meta = response.meta;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
                this.workSamples = [];
                this.meta = null;
                this.errorMessage = 'Failed to load work samples.';
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
