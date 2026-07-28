import { Routes } from '@angular/router';

export const investmentOpportunitiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/investment-opportunities-list/investment-opportunities-list.component').then(m => m.InvestmentOpportunitiesListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/investment-opportunity-details/investment-opportunity-details.component').then(m => m.InvestmentOpportunityDetailsComponent)
    }
];
