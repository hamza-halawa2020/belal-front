import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InvestmentOpportunitiesService } from '../investment-opportunities.service';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';

@Component({
  selector: 'app-investment-opportunities-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
  templateUrl: './investment-opportunities-list.component.html',
  styleUrls: ['./investment-opportunities-list.component.scss']
})
export class InvestmentOpportunitiesListComponent implements OnInit {
  opportunities: any[] = [];
  isLoading: boolean = true;
  meta: any;

  constructor(private investmentOpportunitiesService: InvestmentOpportunitiesService) { }

  ngOnInit(): void {
    this.fetchOpportunities();
  }

  fetchOpportunities(page: number = 1) {
    this.isLoading = true;
    this.investmentOpportunitiesService.getOpportunitiesList(page).subscribe({
      next: (response: any) => {
        this.opportunities = response.data;
        this.meta = response.meta;
        this.isLoading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error: any) => {
        console.error('Error fetching investment opportunities:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    if (this.meta && page >= 1 && page <= this.meta.last_page && page !== this.meta.current_page) {
      this.fetchOpportunities(page);
    }
  }
}