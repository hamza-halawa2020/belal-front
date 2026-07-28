import { Routes } from '@angular/router';

export const privacyPolicyRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/privacy-policy-page/privacy-policy-page.component').then(m => m.PrivacyPolicyPageComponent)
    }
];
