import { NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { MainSlider } from '../../components/main-slider/main-slider.component';
import { HomeApi } from '../../data-access/home.api';
import { HomeData, HomeStats } from '../../models/home.model';

interface DefaultService {
    id: number;
    title: string;
    description: string;
    icon: string;
    link: string;
}

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [
        RouterLink,
        NgClass,
        NgFor,
        NgIf,
        SlicePipe,
        TranslateModule,
        MainSlider,
        ImageFallbackDirective,
    ],
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    readonly contentImageFallback = 'assets/images/about-image.jpeg';
    readonly logoImageFallback = 'assets/images/logo.svg';

    homeData: HomeData | null = null;
    isLoading = true;
    error: string | null = null;
    defaultServices: DefaultService[] = [];

    private readonly defaultStats: HomeStats = {
        completedStudies: 250,
        satisfiedClients: 800,
        yearsExperience: 20,
        successPartners: 75
    };

    constructor(
        public readonly translate: TranslateService,
        private readonly homeApi: HomeApi,
    ) {}

    ngOnInit(): void {
        this.loadHomeData();
        this.updateDefaultServices();

        this.translate.onLangChange
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.updateDefaultServices();
            });
    }

    loadHomeData(): void {
        this.isLoading = true;
        this.error = null;

        this.homeApi.getHomeData().pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: data => {
                this.homeData = this.withFallbackData(data);
            },
            error: () => {
                this.homeData = this.createFallbackHomeData();
            }
        });
    }

    retryLoadData(): void {
        this.loadHomeData();
    }

    formatDate(dateString?: string): string {
        if (!dateString) {
            return '';
        }

        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
        return `${day} ${month}`;
    }

    truncateText(text?: string, maxLength = 100): string {
        if (!text) {
            return '';
        }

        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    }

    getImageUrl(imageUrl?: string, fallback = this.contentImageFallback, image?: string): string {
        return getStoredImageUrl(imageUrl, image) || fallback;
    }

    getPartnerLogoUrl(logoUrl?: string): string {
        if (logoUrl?.includes('logo.clearbit.com')) {
            return this.logoImageFallback;
        }

        return this.getImageUrl(logoUrl, this.logoImageFallback);
    }

    getStarsArray(rating?: number): number[] {
        const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
        return Array(validRating).fill(0);
    }

    private updateDefaultServices(): void {
        this.defaultServices = [
            {
                id: 1,
                title: this.translate.instant('DEFAULT_SERVICE_1_TITLE'),
                description: this.translate.instant('DEFAULT_SERVICE_1_DESC'),
                icon: 'fa-chart-bar',
                link: '/feasibility-studies'
            },
            {
                id: 2,
                title: this.translate.instant('DEFAULT_SERVICE_2_TITLE'),
                description: this.translate.instant('DEFAULT_SERVICE_2_DESC'),
                icon: 'fa-lightbulb',
                link: '/investment-opportunities'
            },
            {
                id: 3,
                title: this.translate.instant('DEFAULT_SERVICE_3_TITLE'),
                description: this.translate.instant('DEFAULT_SERVICE_3_DESC'),
                icon: 'fa-handshake',
                link: '/services'
            }
        ];
    }

    private withFallbackData(data: HomeData): HomeData {
        return {
            stats: data.stats || this.defaultStats,
            latestWorkSamples: data.latestWorkSamples || [],
            teamMembers: data.teamMembers || [],
            testimonials: data.testimonials || [],
            latestPosts: data.latestPosts || [],
            partners: data.partners || []
        };
    }

    private createFallbackHomeData(): HomeData {
        return {
            stats: this.defaultStats,
            latestWorkSamples: [],
            teamMembers: [],
            testimonials: [],
            latestPosts: [],
            partners: []
        };
    }
}
