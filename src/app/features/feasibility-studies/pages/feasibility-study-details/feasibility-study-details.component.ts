import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { FeasibilityStudiesApi } from '../../data-access/feasibility-studies.api';
import { FeasibilityStudy } from '../../models/feasibility-study.model';

@Component({
    selector: 'app-feasibility-study-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './feasibility-study-details.component.html',
    styleUrls: ['./feasibility-study-details.component.scss']
})
export class FeasibilityStudyDetailsComponent implements OnInit {
    study: FeasibilityStudy | null = null;
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
            })
        ).subscribe({
            next: response => {
                this.study = response.data;
            },
            error: () => {
                this.study = null;
                this.errorMessage = 'Failed to load feasibility study details.';
            }
        });
    }

    getImageUrl(study: FeasibilityStudy): string {
        return getStoredImageUrl(study.image_url, study.image);
    }
}
