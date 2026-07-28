import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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

    isShow = false;
    private readonly topPosToStartShowing = 100;

    ngOnInit(): void {
        fromEvent(window, 'scroll').pipe(
            auditTime(100),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.checkScroll();
        });
    }

    checkScroll(): void {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        this.isShow = scrollPosition >= this.topPosToStartShowing;
    }

    scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
