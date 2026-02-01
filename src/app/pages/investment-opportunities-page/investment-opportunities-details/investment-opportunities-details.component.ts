import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvestmentOpportunitiesService } from '../investment-opportunities.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-investment-opportunities-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './investment-opportunities-details.component.html',
  styleUrls: ['./investment-opportunities-details.component.scss']
})
export class InvestmentOpportunitiesDetailsComponent implements OnInit {
  opportunity: any;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private investmentOpportunitiesService: InvestmentOpportunitiesService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchDetails(id);
      }
    });
  }

  fetchDetails(id: string) {
    this.isLoading = true;
    this.investmentOpportunitiesService.getOpportunityDetails(id).subscribe({
      next: (response: any) => {
        this.opportunity = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching investment opportunity details:', error);
        this.isLoading = false;
      }
    });
  }
}