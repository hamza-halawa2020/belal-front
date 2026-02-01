import { Component } from '@angular/core';
import { AboutComponent } from '../../common/about/about.component';
import { WhyUsComponent } from '../../common/why-us/why-us.component';
import { ContactComponent } from '../../common/contact/contact.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { MainSlider } from '../../common/main-slider/main-slider.component';

@Component({
    selector: 'app-home-demo-one',
    standalone: true,
    imports: [
        AboutComponent,
        WhyUsComponent,
        MainSlider,
        ContactComponent,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss',
})
export class HomeDemoOneComponent { }
