import { Routes } from '@angular/router';

export const faqsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/faqs-list/faqs-list.component').then(m => m.FaqsListComponent)
    }
];
