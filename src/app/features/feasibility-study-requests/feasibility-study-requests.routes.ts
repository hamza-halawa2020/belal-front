import { Routes } from '@angular/router';

export const feasibilityStudyRequestsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/request-form/request-form.component').then(m => m.FeasibilityStudyRequestFormComponent)
    }
];
