import { Routes } from '@angular/router';

export const workSamplesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/work-samples-list/work-samples-list.component').then(m => m.WorkSamplesListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/work-sample-details/work-sample-details.component').then(m => m.WorkSampleDetailsComponent)
    }
];
