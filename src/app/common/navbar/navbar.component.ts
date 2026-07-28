import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Event, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

interface NavItem {
    label: string;
    route: string;
}

interface LanguageOption {
    code: string;
    name: string;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        NgIf,
        NgClass,
        NgbCollapseModule,
        NgbDropdownModule,
        TranslateModule,
    ],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    isCollapsed = true;
    isSticky = false;
    currentLanguage = 'en';

    readonly menuItems: NavItem[] = [
        { label: 'HOME', route: '/' },
        { label: 'FEASIBILITY_STUDIES', route: '/feasibility-studies' },
        { label: 'INVESTMENT_OPPORTUNITIES', route: '/investment-opportunities' },
        { label: 'CATEGORIES', route: '/categories' },
        { label: 'About', route: '/about' },
        { label: 'TEAM', route: '/team' },
        { label: 'PARTNERS', route: '/partners' },
        { label: 'TESTIMONIALS', route: '/testimonials' },
        { label: 'FAQS', route: '/faqs' },
    ];

    readonly languages: LanguageOption[] = [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'Arabic' },
    ];

    constructor(
        public readonly router: Router,
        private readonly translate: TranslateService,
    ) {
        this.translate.addLangs(['en', 'ar']);
        this.translate.setDefaultLang('en');

        const savedLang = localStorage.getItem('language');
        const browserLang = this.translate.getBrowserLang();
        const initialLang = savedLang || (browserLang?.match(/en|ar/) ? browserLang : 'en');

        this.translate.use(initialLang);
        this.currentLanguage = initialLang;
        this.applyLanguageDirection(initialLang);
    }

    ngOnInit(): void {
        fromEvent(window, 'scroll').pipe(
            auditTime(100),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.checkScroll();
        });

        this.router.events.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.closeMobileMenu();
            }
        });

        this.translate.onLangChange.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(event => {
            this.currentLanguage = event.lang;
            this.applyLanguageDirection(event.lang);
        });
    }

    switchLanguage(lang: string): void {
        this.translate.use(lang);
        this.currentLanguage = lang;
        this.applyLanguageDirection(lang);
        localStorage.setItem('language', lang);
        this.closeMobileMenu();
    }

    getCurrentLanguageData(): LanguageOption {
        return this.languages.find(lang => lang.code === this.currentLanguage) || this.languages[0];
    }

    closeMobileMenu(): void {
        this.isCollapsed = true;
    }

    toggleMobileMenu(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    private checkScroll(): void {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isSticky = scrollPosition >= 50;
    }

    private applyLanguageDirection(lang: string): void {
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (lang === 'ar') {
            htmlElement.setAttribute('dir', 'rtl');
            htmlElement.setAttribute('lang', 'ar');
            bodyElement.classList.add('rtl');
            bodyElement.classList.remove('ltr');
            return;
        }

        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.setAttribute('lang', 'en');
        bodyElement.classList.add('ltr');
        bodyElement.classList.remove('rtl');
    }
}
