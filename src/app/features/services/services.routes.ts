import { Routes } from '@angular/router';

export const servicesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/services-list/services-list.component').then(m => m.ServicesListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/service-details/service-details.component').then(m => m.ServiceDetailsComponent)
    }
];
