import { Routes } from '@angular/router';

export const successPartnersRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/success-partners-list/success-partners-list.component').then(m => m.SuccessPartnersListComponent)
    }
];
