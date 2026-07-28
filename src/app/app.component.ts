import { ViewportScroller } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BackToTopComponent } from './common/back-to-top/back-to-top.component';
import { FooterComponent } from './common/footer/footer.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { WhatsappFloatComponent } from './common/whatsapp-float/whatsapp-float.component';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, WhatsappFloatComponent, CustomCursorComponent, FooterComponent, BackToTopComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'belal';
    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private readonly router: Router,
        private readonly viewportScroller: ViewportScroller
    ) {
        this.router.events
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((event: Event) => {
                if (event instanceof NavigationEnd) {
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
            });
    }
}
