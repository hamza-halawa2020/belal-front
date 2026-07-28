import { Routes } from '@angular/router';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';

export const routes: Routes = [
    { path: '', component: HomeDemoOneComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'terms-conditions', component: TermsConditionsPageComponent },
    { path: 'contacts', component: ContactPageComponent },

    {
        path: 'services',
        loadChildren: () => import('./features/services/services.routes').then(m => m.servicesRoutes)
    },

    {
        path: 'work-samples',
        loadChildren: () => import('./features/work-samples/work-samples.routes').then(m => m.workSamplesRoutes)
    },

    {
        path: 'posts',
        loadChildren: () => import('./features/posts/posts.routes').then(m => m.postsRoutes)
    },

    {
        path: 'feasibility-studies',
        loadChildren: () => import('./features/feasibility-studies/feasibility-studies.routes').then(m => m.feasibilityStudiesRoutes)
    },

    {
        path: 'request-feasibility-study',
        loadComponent: () => import('./pages/feasibility-study-request-page/feasibility-study-request-form/feasibility-study-request-form.component').then(m => m.FeasibilityStudyRequestFormComponent)
    },

    {
        path: 'investment-opportunities',
        loadComponent: () => import('./pages/investment-opportunities-page/investment-opportunities-list/investment-opportunities-list.component').then(m => m.InvestmentOpportunitiesListComponent)
    },
    {
        path: 'investment-opportunities/:id',
        loadComponent: () => import('./pages/investment-opportunities-page/investment-opportunities-details/investment-opportunities-details.component').then(m => m.InvestmentOpportunitiesDetailsComponent)
    },

    {
        path: 'categories',
        loadChildren: () => import('./features/categories/categories.routes').then(m => m.categoriesRoutes)
    },

    {
        path: 'faqs',
        loadComponent: () => import('./pages/faqs-page/faqs-page.component').then(m => m.FaqsPageComponent)
    },

    {
        path: 'team',
        loadComponent: () => import('./pages/staff-page/staff-list/staff-list.component').then(m => m.StaffListComponent)
    },

    {
        path: 'partners',
        loadComponent: () => import('./pages/success-partners-page/success-partners-list/success-partners-list.component').then(m => m.SuccessPartnersListComponent)
    },

    {
        path: 'testimonials',
        loadComponent: () => import('./pages/reviews-page/reviews-list/reviews-list.component').then(m => m.ReviewsListComponent)
    },

    { path: '**', component: ErrorPageComponent },
];
