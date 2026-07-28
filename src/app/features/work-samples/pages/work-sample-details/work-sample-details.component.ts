import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
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
    private readonly destroyRef = inject(DestroyRef);

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
            }),
            takeUntilDestroyed(this.destroyRef)
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

    getImageUrl(workSample: WorkSample): string {
        return getStoredImageUrl(workSample.image_url, workSample.image);
    }
}
