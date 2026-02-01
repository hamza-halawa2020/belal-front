import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [
        RouterLink,
        ContactComponent,
        FooterComponent,
        TranslateModule,
    ],
    templateUrl: './contact-page.component.html',
    styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent {
    infoEmail = 'info@gorhom.com';
    adminEmail = 'contact@gorhom.com';
    phone1 = '+201034100565';
    phone2 = '+201034100566';
}
