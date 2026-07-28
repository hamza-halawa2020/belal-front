import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { InvestmentOpportunitiesApi } from '../../data-access/investment-opportunities.api';
import { InvestmentOpportunity } from '../../models/investment-opportunity.model';

@Component({
    selector: 'app-investment-opportunity-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './investment-opportunity-details.component.html',
    styleUrls: ['./investment-opportunity-details.component.scss']
})
export class InvestmentOpportunityDetailsComponent implements OnInit {
    opportunity: InvestmentOpportunity | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly investmentOpportunitiesApi: InvestmentOpportunitiesApi
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => Boolean(id)),
            switchMap(id => {
                this.isLoading = true;
                this.errorMessage = '';

                return this.investmentOpportunitiesApi.getOpportunity(id).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                );
            })
        ).subscribe({
            next: response => {
                this.opportunity = response.data;
            },
            error: () => {
                this.opportunity = null;
                this.errorMessage = 'Failed to load investment opportunity details.';
            }
        });
    }
}
