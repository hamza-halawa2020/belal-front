import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: 'img[appImageFallback]',
    standalone: true
})
export class ImageFallbackDirective {
    @Input() appImageFallback = '';

    private hasAppliedFallback = false;
    private readonly defaultFallback = 'assets/images/about-image.jpeg';

    constructor(private readonly elementRef: ElementRef<HTMLImageElement>) {}

    @HostListener('error')
    onImageError(): void {
        if (this.hasAppliedFallback) {
            return;
        }

        this.hasAppliedFallback = true;
        const image = this.elementRef.nativeElement;
        image.removeAttribute('srcset');
        image.src = this.appImageFallback || this.defaultFallback;
    }
}
