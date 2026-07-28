import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { ServicesApi } from '../../data-access/services.api';
import { Service } from '../../models/service.model';

@Component({
    selector: 'app-services-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    services: Service[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly servicesApi: ServicesApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.servicesApi.getServices(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.services = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.services = [];
                this.meta = null;
                this.errorMessage = 'Failed to load services.';
            }
        });
    }

    onPageChange(page: number): void {
        if (!canLoadPage(this.meta, page)) {
            return;
        }

        this.loadPage(page);
    }
}
