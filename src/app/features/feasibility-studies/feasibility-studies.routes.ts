import { Routes } from '@angular/router';

export const feasibilityStudiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/feasibility-studies-list/feasibility-studies-list.component').then(m => m.FeasibilityStudiesListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/feasibility-study-details/feasibility-study-details.component').then(m => m.FeasibilityStudyDetailsComponent)
    }
];
