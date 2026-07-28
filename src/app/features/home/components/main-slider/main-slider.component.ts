import { CommonModule, NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
    CarouselComponent,
    CarouselModule,
    OwlOptions,
} from 'ngx-owl-carousel-o';
import { MainSliderApi } from './main-slider.api';
import { MainSliderItem } from './main-slider.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-main-slider',
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        CarouselModule,
        NgIf,
        NgClass,
        NgOptimizedImage,
        TranslateModule
    ],
    templateUrl: './main-slider.component.html',
    styleUrls: ['./main-slider.component.scss'],
    providers: [MainSliderApi],
})
export class MainSlider implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    sliderData: MainSliderItem[] | null = null;

    // Reference to the OwlCarousel component
    @ViewChild('owlCarousel', { static: false })
    owlCarousel!: CarouselComponent;

    currentOptions: OwlOptions;

    feedbackSlides: OwlOptions = {
        items: 1,
        nav: false, // Disable default nav buttons
        loop: true,
        // margin: 25,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoHeight: false,
        responsive: {
            0: {
                autoHeight: false,
                autoplay: true,
            },
        },
    };

    feedbackSlides2: OwlOptions = {
        items: 1,
        nav: false, // Disable default nav buttons
        loop: true,
        // margin: 25,
        dots: true,
        autoplay: true,
        autoplayHoverPause: true,
        rtl: true,
        autoHeight: false,
        responsive: {
            0: {
                autoHeight: false,
                autoplay: true,
            },
        },
    };

    constructor(
        private mainSliderApi: MainSliderApi,
        public translate: TranslateService
    ) {
        this.currentOptions =
            this.translate.currentLang === 'ar'
                ? this.feedbackSlides2
                : this.feedbackSlides;
        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(event => {
                this.currentOptions =
                    event.lang === 'ar'
                        ? this.feedbackSlides2
                        : this.feedbackSlides;
            });
    }

    ngOnInit(): void {
        this.fetchSliderData();
    }

    fetchSliderData(): void {
        this.mainSliderApi.getSlides().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.sliderData = response.data || [];
            },
            error: () => {
                this.sliderData = [];
            }
        });
    }

    prevSlide(): void {
        if (this.owlCarousel) {
            this.owlCarousel.prev();
        }
    }

    nextSlide(): void {
        if (this.owlCarousel) {
            this.owlCarousel.next();
        }
    }
}
