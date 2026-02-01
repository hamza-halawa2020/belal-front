import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-whatsapp-float',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './whatsapp-float.component.html',
    styleUrls: ['./whatsapp-float.component.scss']
})
export class WhatsappFloatComponent {
    phone: string = '201034100565'; // رقم الواتساب بدون علامة +

    openWhatsApp() {
        const message = encodeURIComponent('مرحباً، أريد الاستفسار عن خدماتكم');
        const whatsappUrl = `https://wa.me/${this.phone}?text=${message}`;
        window.open(whatsappUrl, '_blank');
    }
}