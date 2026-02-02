import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../services.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';

@Component({
    selector: 'app-services-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, NgOptimizedImage, PaginationComponent, ContentCardComponent],
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
    services: any[] = [];
    isLoading: boolean = true;

    meta: any;

    constructor(private servicesService: ServicesService) { }

    get pages(): number[] {
        if (!this.meta || !this.meta.last_page) {
            return [];
        }

        const currentPage = this.meta.current_page;
        const lastPage = this.meta.last_page;
        const pages: number[] = [];

        // Show first page
        pages.push(1);

        // Show pages around current page
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(lastPage - 1, currentPage + 1);

        // Add ellipsis if needed
        if (startPage > 2) {
            pages.push(-1); // -1 represents ellipsis
        }

        // Add pages around current
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed
        if (endPage < lastPage - 1) {
            pages.push(-1); // -1 represents ellipsis
        }

        // Show last page if there's more than one page
        if (lastPage > 1) {
            pages.push(lastPage);
        }

        return pages;
    }

    ngOnInit(): void {
        this.fetchServices();
    }

    fetchServices(page: number = 1) {
        this.isLoading = true;
        this.servicesService.getServicesList(page).subscribe({
            next: (response: any) => {
                this.services = response.data;
                this.meta = response.meta;
                this.isLoading = false;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: (error: any) => {
                this.isLoading = false;
            }
        });
    }

    onPageChange(page: number) {
        if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
            this.fetchServices(page);
        }
    }
}
