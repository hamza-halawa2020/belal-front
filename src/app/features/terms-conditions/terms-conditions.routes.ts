import { Routes } from '@angular/router';

export const termsConditionsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/terms-conditions-page/terms-conditions-page.component').then(m => m.TermsConditionsPageComponent)
    }
];
