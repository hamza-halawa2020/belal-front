import { Routes } from '@angular/router';

export const categoriesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/categories-list/categories-list.component').then(m => m.CategoriesListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/category-details/category-details.component').then(m => m.CategoryDetailsComponent)
    }
];
