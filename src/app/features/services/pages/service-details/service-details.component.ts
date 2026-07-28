import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { ServicesApi } from '../../data-access/services.api';
import { Service } from '../../models/service.model';

@Component({
    selector: 'app-service-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, ImageFallbackDirective],
    templateUrl: './service-details.component.html',
    styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    service: Service | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly servicesApi: ServicesApi
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => Boolean(id)),
            switchMap(id => {
                this.isLoading = true;
                this.errorMessage = '';

                return this.servicesApi.getService(id).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.service = response.data;
            },
            error: () => {
                this.service = null;
                this.errorMessage = 'Failed to load service details.';
            }
        });
    }

    getImageUrl(service: Service): string {
        return getStoredImageUrl(service.image_url, service.image);
    }
}
