import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import { getStoredImageUrl } from '../../utils/image-url.util';

export interface ContentCardItem {
    id: number;
    title: string;
    description?: string;
    image?: string;
    image_url?: string;
}

@Component({
    selector: 'app-content-card',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, ImageFallbackDirective],
    templateUrl: './content-card.component.html',
    styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {
    @Input() item: ContentCardItem | null = null;
    @Input() routePath: string = '';

    getImageUrl(): string {
        return getStoredImageUrl(this.item?.image_url, this.item?.image);
    }
}
