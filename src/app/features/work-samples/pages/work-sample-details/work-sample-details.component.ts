import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { FinancialMetricItem, parseFinancialMetrics } from '../../../../shared/utils/financial-metrics.util';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { parseJsonStringList } from '../../../../shared/utils/json-list.util';
import { CheckListComponent } from '../../../../shared/components/check-list/check-list.component';
import { KeyValueListComponent } from '../../../../shared/components/key-value-list/key-value-list.component';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { WorkSamplesApi } from '../../data-access/work-samples.api';
import { WorkSample } from '../../models/work-sample.model';

@Component({
    selector: 'app-work-sample-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, CheckListComponent, KeyValueListComponent, ImageFallbackDirective],
    templateUrl: './work-sample-details.component.html',
    styleUrls: ['./work-sample-details.component.scss']
})
export class WorkSampleDetailsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    workSample: WorkSample | null = null;
    providedServices: string[] = [];
    studyContentItems: string[] = [];
    financialMetrics: FinancialMetricItem[] = [];
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
                this.providedServices = parseJsonStringList(response.data.services);
                this.studyContentItems = parseJsonStringList(response.data.study_content);
                this.financialMetrics = parseFinancialMetrics(response.data.financial_metrics);
            },
            error: () => {
                this.workSample = null;
                this.providedServices = [];
                this.studyContentItems = [];
                this.financialMetrics = [];
                this.errorMessage = 'Failed to load work sample details.';
            }
        });
    }

    getImageUrl(workSample: WorkSample): string {
        return getStoredImageUrl(workSample.image_url, workSample.image);
    }
}
