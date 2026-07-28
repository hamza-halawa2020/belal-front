import { isPlatformBrowser, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { auditTime } from 'rxjs/operators';

@Component({
    selector: 'app-back-to-top',
    standalone: true,
    imports: [NgIf],
    templateUrl: './back-to-top.component.html',
    styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    isShow = false;
    private readonly topPosToStartShowing = 100;

    ngOnInit(): void {
        if (!this.isBrowser) {
            return;
        }

        fromEvent(window, 'scroll').pipe(
            auditTime(100),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.checkScroll();
        });
    }

    checkScroll(): void {
        if (!this.isBrowser) {
            return;
        }

        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isShow = scrollPosition >= this.topPosToStartShowing;
    }

    scrollToTop(): void {
        if (!this.isBrowser) {
            return;
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
