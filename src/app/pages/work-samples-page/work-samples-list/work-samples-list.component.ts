import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkSamplesService } from '../work-samples.service';
import { TranslateModule } from '@ngx-translate/core';

import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-work-samples-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, NgOptimizedImage, PaginationComponent],
    templateUrl: './work-samples-list.component.html',
    styleUrls: ['./work-samples-list.component.scss']
})
export class WorkSamplesListComponent implements OnInit {
    workSamples: any[] = [];
    isLoading: boolean = true;

    meta: any;

    constructor(private workSamplesService: WorkSamplesService) { }

    ngOnInit(): void {
        this.fetchWorkSamples();
    }

    fetchWorkSamples(page: number = 1) {
        this.isLoading = true;
        this.workSamplesService.getWorkSamplesList(page).subscribe({
            next: (response: any) => {
                this.workSamples = response.data;
                this.meta = response.meta;
                this.isLoading = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: (error: any) => {
                console.error('Error fetching work samples:', error);
                this.isLoading = false;
            }
        });
    }

    onPageChange(page: number) {
        if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
            this.fetchWorkSamples(page);
        }
    }
}
