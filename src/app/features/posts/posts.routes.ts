import { Routes } from '@angular/router';

export const postsRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/posts-list/posts-list.component').then(m => m.PostsListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/post-details/post-details.component').then(m => m.PostDetailsComponent)
    }
];
