import { Routes } from '@angular/router';

export const reviewsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/reviews-list/reviews-list.component').then(m => m.ReviewsListComponent)
    }
];
