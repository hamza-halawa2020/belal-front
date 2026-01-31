import { NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgIf,
        NgClass,
        NgbCollapseModule,
        TranslateModule,
    ],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
    isCollapsed = true;
    cartData: any[] = [];
    favClientData: any[] = [];
    favData: any[] = [];
    favoritesCount: number = 0; // New favorites count from FavoritesService
    EMAIL: string = 'info@gorhom.net';
    public cartSubscription!: Subscription;
    public favSubscription!: Subscription;
    public favClientSubscription!: Subscription;
    public favoritesSubscription!: Subscription; // New subscription for FavoritesService

    isLoggedIn: boolean = false;
    isSticky: boolean = false;
    currentLanguage: string = 'en'; // Track current language
    private subscriptions = new Subscription();

    constructor(
        public router: Router,
        private translate: TranslateService,
    ) {

        // Initialize languages
        this.translate.addLangs(['en', 'ar']);
        this.translate.setDefaultLang('en');

        // Load saved language from localStorage or use browser language
        const savedLang = localStorage.getItem('language');
        const browserLang = this.translate.getBrowserLang();
        const initialLang =
            savedLang || (browserLang?.match(/en|ar/) ? browserLang : 'en');
        this.translate.use(initialLang);
        this.currentLanguage = initialLang;
        this.applyLanguageDirection(initialLang);
    }

    ngOnInit(): void {








        // Optimize scroll listener to prevent forced reflows
        this.subscriptions.add(
            fromEvent(window, 'scroll')
                .pipe(auditTime(100))
                .subscribe(() => {
                    this.checkScroll();
                })
        );



        // Update currentLanguage when language changes
        this.translate.onLangChange.subscribe((event) => {
            this.currentLanguage = event.lang;
            this.applyLanguageDirection(event.lang);
        });
    }

    ngOnDestroy() {
        if (this.cartSubscription) this.cartSubscription.unsubscribe();
        if (this.favSubscription) this.favSubscription.unsubscribe();
        if (this.favClientSubscription)
            this.favClientSubscription.unsubscribe();
        if (this.favoritesSubscription)
            this.favoritesSubscription.unsubscribe();
        this.subscriptions.unsubscribe();
    }

    checkScroll() {
        const scrollPosition =
            window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }

    logout() {
        this.isLoggedIn = false; // Update isLoggedIn after logout
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
        this.currentLanguage = lang;
        this.applyLanguageDirection(lang);
        localStorage.setItem('language', lang); // Save to localStorage
    }

    getCurrentLanguage(): string {
        return this.currentLanguage || this.translate.getDefaultLang();
    }

    // Helper method to apply language direction
    private applyLanguageDirection(lang: string) {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }
}