import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-about-page',
    standalone: true,
    imports: [
        RouterLink,
        FooterComponent,
        TranslateModule,
    ],
    templateUrl: './about-page.component.html',
    styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent implements OnInit {
    ngOnInit(): void {
        // Component initialization
    }
}
