import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { StaffApi } from '../../data-access/staff.api';
import { StaffMember } from '../../models/staff-member.model';

@Component({
    selector: 'app-staff-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent],
    templateUrl: './staff-list.component.html',
    styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    staff: StaffMember[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly staffApi: StaffApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.staffApi.getStaff(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.staff = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.staff = [];
                this.meta = null;
                this.errorMessage = 'Failed to load team members.';
            }
        });
    }

    onPageChange(page: number): void {
        if (!canLoadPage(this.meta, page)) {
            return;
        }

        this.loadPage(page);
    }

    getImageUrl(member: StaffMember): string {
        return getStoredImageUrl(member.image_url, member.image);
    }
}
