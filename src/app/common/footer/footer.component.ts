import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [RouterLink, NgIf, NgClass, TranslateModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
    email: string = 'info@gorhom.com';
    phone: string = '+201034100565';

    constructor(public router: Router) { }

    ngOnInit() {
        // Initialize any setup if needed
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    subscribeNewsletter(email: string) {
        if (email && this.isValidEmail(email)) {
            // Handle newsletter subscription
            console.log('Newsletter subscription for:', email);
            // You can add actual subscription logic here
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
