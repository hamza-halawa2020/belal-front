import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SuccessPartnersService } from '../success-partners.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-success-partners-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent],
  templateUrl: './success-partners-list.component.html',
  styleUrls: ['./success-partners-list.component.scss']
})
export class SuccessPartnersListComponent implements OnInit {
  partners: any[] = [];
  isLoading: boolean = true;
  meta: any;

  constructor(private successPartnersService: SuccessPartnersService) { }

  ngOnInit(): void {
    this.fetchPartners();
  }

  fetchPartners(page: number = 1) {
    this.isLoading = true;
    this.successPartnersService.getPartnersList(page).subscribe({
      next: (response: any) => {
        this.partners = response.data;
        this.meta = response.meta;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error: any) => {
        console.error('Error fetching success partners:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
      this.fetchPartners(page);
    }
  }

  openPartnerLink(link: string) {
    if (link) {
      // Add https:// if not present
      const url = link.startsWith('http') ? link : `https://${link}`;
      window.open(url, '_blank');
    }
  }
}