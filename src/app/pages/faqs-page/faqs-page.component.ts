import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqsComponent } from '../../common/faqs/faqs.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-faqs-page',
  standalone: true,
  imports: [CommonModule, FaqsComponent, TranslateModule],
  templateUrl: './faqs-page.component.html',
  styleUrls: ['./faqs-page.component.scss']
})
export class FaqsPageComponent {

}