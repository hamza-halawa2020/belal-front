import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf, SlicePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CarouselModule, OwlOptions, CarouselComponent } from 'ngx-owl-carousel-o';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { MainSlider } from '../../components/main-slider/main-slider.component';
import { HomeApi, HomeData } from '../../data-access/home.api';

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
        CarouselModule,
        MainSlider,
    ],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, AfterViewInit {
    private readonly destroyRef = inject(DestroyRef);

    @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
    @ViewChild('testimonialsCarousel', { static: false }) testimonialsCarousel!: CarouselComponent;
    @ViewChild('partnersCarousel', { static: false }) partnersCarousel!: CarouselComponent;
    
    homeData: HomeData | null = null;
    isLoading = true;
    error: string | null = null;

    animatedStats = {
        completedStudies: 0,
        satisfiedClients: 0,
        yearsExperience: 0,
        successPartners: 0
    };
    
    hasAnimated = false;

    defaultStats = {
        completedStudies: 250,
        satisfiedClients: 800,
        yearsExperience: 20,
        successPartners: 75
    };

    defaultServices: Array<{ id: number; title: string; description: string; icon: string; link: string }> = [];

    partnersCarouselOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        autoplaySpeed: 1000,
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 4
            }
        },
        nav: false,
        margin: 20
    };

    testimonialsCarouselOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: true,
        dots: true,
        navSpeed: 700,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        autoplaySpeed: 1000,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        },
        nav: false,
        margin: 20
    };
    constructor(
        public translate: TranslateService,
        private homeApi: HomeApi,
        private cdr: ChangeDetectorRef
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
    
    

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.homeData || !this.isLoading) {
                this.startCounterAnimation();
            }
        }, 1000);
        
        setTimeout(() => {
            this.setupScrollObserver();
        }, 100);
        
        setTimeout(() => {
            this.reinitializeCarousels();
        }, 500);
    }


loadHomeData(): void {
        this.isLoading = true;
        this.error = null;

        this.homeApi.getHomeData().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (data) => {
                if (!this.homeData) {
                    this.homeData = {
                        stats: this.defaultStats,
                        latestWorkSamples: [],
                        teamMembers: [],
                        testimonials: [],
                        latestPosts: [],
                        partners: []
                    };
                }
                
                if (data.stats) {
                    this.homeData.stats = data.stats;
                }
                if (data.testimonials && data.testimonials.length > 0) {
                    this.homeData.testimonials = data.testimonials;
                }
                if (data.partners && data.partners.length > 0) {
                    this.homeData.partners = data.partners;
                }
                if (data.latestWorkSamples && data.latestWorkSamples.length > 0) {
                    this.homeData.latestWorkSamples = data.latestWorkSamples;
                }
                if (data.teamMembers && data.teamMembers.length > 0) {
                    this.homeData.teamMembers = data.teamMembers;
                }
                if (data.latestPosts && data.latestPosts.length > 0) {
                    this.homeData.latestPosts = data.latestPosts;
                }
                
                this.isLoading = false;
                
                this.updateCarouselOptions();
                
                setTimeout(() => {
                    this.reinitializeCarousels();
                }, 300);
                
                setTimeout(() => {
                    if (!this.hasAnimated) {
                        this.startCounterAnimation();
                    }
                }, 500);
            },
            error: () => {
                if (!this.homeData) {
                    this.homeData = {
                        stats: this.defaultStats,
                        latestWorkSamples: [],
                        teamMembers: [],
                        testimonials: [],
                        latestPosts: [],
                        partners: []
                    };
                }
                this.isLoading = false;
                
                setTimeout(() => {
                    if (!this.hasAnimated) {
                        this.startCounterAnimation();
                    }
                }, 500);
            }
        });
    }

    retryLoadData(): void {
        this.loadHomeData();
    }

    updateDefaultServices(): void {
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

    formatDate(dateString?: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
        return `${day} ${month}`;
    }

    truncateText(text?: string, maxLength: number = 100): string {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    getImageUrl(imageUrl?: string, fallback: string = 'assets/images/placeholder.jpg', image?: string): string {
        return getStoredImageUrl(imageUrl, image) || fallback;
    }

    private updateCarouselOptions(): void {
        if (this.homeData) {
            const partnersCount = this.homeData.partners?.length || 0;
            if (partnersCount > 0) {
                this.partnersCarouselOptions = {
                    ...this.partnersCarouselOptions,
                    loop: partnersCount > 1,
                    autoplay: partnersCount > 1,
                    dots: partnersCount > 1
                };
            }
            
            const testimonialsCount = this.homeData.testimonials?.length || 0;
            if (testimonialsCount > 0) {
                this.testimonialsCarouselOptions = {
                    ...this.testimonialsCarouselOptions,
                    loop: testimonialsCount > 1,
                    autoplay: testimonialsCount > 1,
                    dots: testimonialsCount > 1
                };
            }
        }
    }

    private reinitializeCarousels(): void {
        setTimeout(() => {
            this.cdr.detectChanges();
        }, 100);
    }

    getStarsArray(rating?: number): number[] {
        const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
        return Array(validRating).fill(0);
    }

    private setupScrollObserver(): void {
        
        if (!this.statsSection) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.startCounterAnimation();
                        this.hasAnimated = true;
                    }
                });
            },
            {
                threshold: 0.3, 
                rootMargin: '0px 0px -50px 0px'
            }
        );

        observer.observe(this.statsSection.nativeElement);
    }

    private startCounterAnimation(): void {
        if (this.hasAnimated) {
            return;
        }
        
        this.hasAnimated = true;
        
        const stats = this.homeData?.stats || this.defaultStats;
        
        if (this.statsSection) {
            const statCards = this.statsSection.nativeElement.querySelectorAll('.stat-card');
            statCards.forEach((card: HTMLElement) => {
                card.classList.add('counting');
            });
            
            setTimeout(() => {
                statCards.forEach((card: HTMLElement) => {
                    card.classList.remove('counting');
                });
            }, 3000);
        }
        
        this.animateCounter('completedStudies', stats.completedStudies, 2000);
        this.animateCounter('satisfiedClients', stats.satisfiedClients, 2500);
        this.animateCounter('yearsExperience', stats.yearsExperience, 1500);
        this.animateCounter('successPartners', stats.successPartners, 2200);
    }

    testCounter(): void {
        this.hasAnimated = false; 
        this.resetCounters();
        setTimeout(() => {
            this.startCounterAnimation();
        }, 100);
    }

    private resetCounters(): void {
        this.animatedStats = {
            completedStudies: 0,
            satisfiedClients: 0,
            yearsExperience: 0,
            successPartners: 0
        };
    }
    private animateCounter(property: keyof typeof this.animatedStats, targetValue: number, duration: number): void {
        
        if (targetValue <= 0) {
            return;
        }
        
        const startValue = 0;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            this.animatedStats[property] = currentValue;
            
            if (Math.floor(progress * 10) !== Math.floor(((elapsed - 16) / duration) * 10)) {
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.animatedStats[property] = targetValue;
            }
        };
        
        requestAnimationFrame(animate);
        
        setTimeout(() => {
            if (this.animatedStats[property] === 0) {
                let current = 0;
                const step = targetValue / 50;
                const interval = setInterval(() => {
                    current += step;
                    if (current >= targetValue) {
                        current = targetValue;
                        clearInterval(interval);
                    }
                    this.animatedStats[property] = Math.floor(current);
                }, 40);
            }
        }, 1000);
    }
}
