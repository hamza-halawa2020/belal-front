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

    { path: '**', component: ErrorPageComponent },
];
