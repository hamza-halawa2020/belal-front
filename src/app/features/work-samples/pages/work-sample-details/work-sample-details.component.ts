import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { WorkSamplesApi } from '../../data-access/work-samples.api';
import { WorkSample } from '../../models/work-sample.model';

@Component({
    selector: 'app-work-sample-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './work-sample-details.component.html',
    styleUrls: ['./work-sample-details.component.scss']
})
export class WorkSampleDetailsComponent implements OnInit {
    workSample: WorkSample | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly workSamplesApi: WorkSamplesApi
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => Boolean(id)),
            switchMap(id => {
                this.isLoading = true;
                this.errorMessage = '';

                return this.workSamplesApi.getWorkSample(id).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                );
            })
        ).subscribe({
            next: response => {
                this.workSample = response.data;
            },
            error: () => {
                this.workSample = null;
                this.errorMessage = 'Failed to load work sample details.';
            }
        });
    }
}
