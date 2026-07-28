import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-whatsapp-float',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './whatsapp-float.component.html',
    styleUrls: ['./whatsapp-float.component.scss']
})
export class WhatsappFloatComponent {
    readonly phone = '201034100565';
    readonly message = 'Hello, I would like to ask about your services';

    openWhatsApp(): void {
        const whatsappUrl = `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
}
