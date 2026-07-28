import { Routes } from '@angular/router';
import { HomeDemoOneComponent } from './demos/home-demo-one/home-demo-one.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsConditionsPageComponent } from './pages/terms-conditions-page/terms-conditions-page.component';

export const routes: Routes = [
    { path: '', component: HomeDemoOneComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'terms-conditions', component: TermsConditionsPageComponent },
    {
        path: 'contacts',
        loadChildren: () => import('./features/contact/contact.routes').then(m => m.contactRoutes)
    },

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
        loadChildren: () => import('./features/feasibility-study-requests/feasibility-study-requests.routes').then(m => m.feasibilityStudyRequestsRoutes)
    },

    {
        path: 'investment-opportunities',
        loadChildren: () => import('./features/investment-opportunities/investment-opportunities.routes').then(m => m.investmentOpportunitiesRoutes)
    },

    {
        path: 'categories',
        loadChildren: () => import('./features/categories/categories.routes').then(m => m.categoriesRoutes)
    },

    {
        path: 'faqs',
        loadChildren: () => import('./features/faqs/faqs.routes').then(m => m.faqsRoutes)
    },

    {
        path: 'team',
        loadChildren: () => import('./features/staff/staff.routes').then(m => m.staffRoutes)
    },

    {
        path: 'partners',
        loadChildren: () => import('./features/success-partners/success-partners.routes').then(m => m.successPartnersRoutes)
    },

    {
        path: 'testimonials',
        loadChildren: () => import('./features/reviews/reviews.routes').then(m => m.reviewsRoutes)
    },

    { path: '**', component: ErrorPageComponent },
];
