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
import { FeasibilityStudiesApi } from '../../data-access/feasibility-studies.api';
import { FeasibilityStudy } from '../../models/feasibility-study.model';

@Component({
    selector: 'app-feasibility-study-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, CheckListComponent, KeyValueListComponent, ImageFallbackDirective],
    templateUrl: './feasibility-study-details.component.html',
    styleUrls: ['./feasibility-study-details.component.scss']
})
export class FeasibilityStudyDetailsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    study: FeasibilityStudy | null = null;
    providedServices: string[] = [];
    studyContentItems: string[] = [];
    financialMetrics: FinancialMetricItem[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly feasibilityStudiesApi: FeasibilityStudiesApi
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => Boolean(id)),
            switchMap(id => {
                this.isLoading = true;
                this.errorMessage = '';

                return this.feasibilityStudiesApi.getStudy(id).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.study = response.data;
                this.providedServices = parseJsonStringList(response.data.services);
                this.studyContentItems = parseJsonStringList(response.data.study_content);
                this.financialMetrics = parseFinancialMetrics(response.data.financial_metrics);
            },
            error: () => {
                this.study = null;
                this.providedServices = [];
                this.studyContentItems = [];
                this.financialMetrics = [];
                this.errorMessage = 'UNEXPECTED_ERROR';
            }
        });
    }

    getImageUrl(study: FeasibilityStudy): string {
        return getStoredImageUrl(study.image_url, study.image);
    }
}
