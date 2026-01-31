import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-content-card',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule],
    templateUrl: './content-card.component.html',
    styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {
    @Input() item: any;
    @Input() routePath: string = '';
    @Input() animationDelay: number = 0;
}
