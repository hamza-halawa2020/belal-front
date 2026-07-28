import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';

@Component({
    selector: 'app-whatsapp-float',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './whatsapp-float.component.html',
    styleUrls: ['./whatsapp-float.component.scss']
})
export class WhatsappFloatComponent {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly isBrowser = isPlatformBrowser(this.platformId);

    readonly phone = '201034100565';
    readonly message = 'Hello, I would like to ask about your services';

    openWhatsApp(): void {
        if (!this.isBrowser) {
            return;
        }

        const whatsappUrl = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
}
