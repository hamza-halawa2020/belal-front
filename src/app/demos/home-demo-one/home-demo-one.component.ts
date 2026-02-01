import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../../common/footer/footer.component';
import { BackToTopComponent } from '../../common/back-to-top/back-to-top.component';
import { MainSlider } from '../../common/main-slider/main-slider.component';
import { HomeService, HomeData } from './home.service';

@Component({
    selector: 'app-home-demo-one',
    standalone: true,
    imports: [
        RouterLink,
        NgClass,
        NgFor,
        NgIf,
        HttpClientModule,
        TranslateModule,
        MainSlider,
        FooterComponent,
        BackToTopComponent,
    ],
    templateUrl: './home-demo-one.component.html',
    styleUrl: './home-demo-one.component.scss',
})
export class HomeDemoOneComponent implements OnInit, AfterViewInit {
    @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
    
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

    // بيانات افتراضية في حالة عدم توفر البيانات من API
    defaultStats = {
        completedStudies: 150,
        satisfiedClients: 500,
        yearsExperience: 15,
        successPartners: 50
    };

    defaultServices = [
        {
            id: 1,
            title: 'دراسات الجدوى',
            description: 'نقدم دراسات جدوى شاملة ومفصلة لمساعدتك في اتخاذ قرارات استثمارية مدروسة',
            icon: 'fa-chart-bar',
            link: '/feasibility-studies'
        },
        {
            id: 2,
            title: 'الفرص الاستثمارية',
            description: 'اكتشف أفضل الفرص الاستثمارية المتاحة مع تحليل مفصل للمخاطر والعوائد',
            icon: 'fa-lightbulb',
            link: '/investment-opportunities'
        },
        {
            id: 3,
            title: 'الاستشارات المالية',
            description: 'احصل على استشارات مالية متخصصة من فريق من الخبراء في مجال الاستثمار',
            icon: 'fa-handshake',
            link: '/services'
        }
    ];

    constructor(
        public translate: TranslateService,
        private homeService: HomeService
    ) {}

    ngOnInit(): void {
        this.loadHomeData();
    }

    ngAfterViewInit(): void {
        // تشغيل العداد مباشرة بعد تحميل البيانات
        setTimeout(() => {
            if (this.homeData || !this.isLoading) {
                this.startCounterAnimation();
            }
        }, 1000);
        
        // إعداد مراقب التمرير كبديل
        setTimeout(() => {
            this.setupScrollObserver();
        }, 100);
    }

    loadHomeData(): void {
        this.isLoading = true;
        this.error = null;

        this.homeService.getHomeData().subscribe({
            next: (data) => {
                this.homeData = data;
                this.isLoading = false;
                
                // تشغيل العداد بعد تحميل البيانات
                setTimeout(() => {
                    if (!this.hasAnimated) {
                        this.startCounterAnimation();
                    }
                }, 500);
            },
            error: (error) => {
                console.error('Error loading home data:', error);
                this.error = 'حدث خطأ في تحميل البيانات';
                this.isLoading = false;
                // استخدام البيانات الافتراضية في حالة الخطأ
                this.homeData = {
                    stats: this.defaultStats,
                    latestWorkSamples: [],
                    teamMembers: [],
                    testimonials: [],
                    latestPosts: [],
                    partners: []
                };
                
                // تشغيل العداد مع البيانات الافتراضية
                setTimeout(() => {
                    if (!this.hasAnimated) {
                        this.startCounterAnimation();
                    }
                }, 500);
            }
        });
    }

    // دالة لإعادة المحاولة في حالة الخطأ
    retryLoadData(): void {
        this.loadHomeData();
    }

    // دالة للحصول على تاريخ منسق
    formatDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
        return `${day} ${month}`;
    }

    // دالة للحصول على مقتطف من النص
    truncateText(text: string, maxLength: number = 100): string {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // دالة للحصول على رابط الصورة مع fallback
    getImageUrl(imageUrl: string, fallback: string = 'assets/images/placeholder.jpg'): string {
        return imageUrl || fallback;
    }

    // دالة للحصول على تقييم بالنجوم
    getStarsArray(rating: number): number[] {
        return Array(Math.floor(rating)).fill(0);
    }

    // إعداد مراقب التمرير
    private setupScrollObserver(): void {
        console.log('Setting up scroll observer...');
        
        if (!this.statsSection) {
            console.error('Stats section not found!');
            return;
        }

        console.log('Stats section found:', this.statsSection.nativeElement);

        const observer = new IntersectionObserver(
            (entries) => {
                console.log('Intersection observer triggered:', entries);
                entries.forEach((entry) => {
                    console.log('Entry intersecting:', entry.isIntersecting, 'Has animated:', this.hasAnimated);
                    if (entry.isIntersecting && !this.hasAnimated) {
                        console.log('Starting counter animation...');
                        this.startCounterAnimation();
                        this.hasAnimated = true;
                    }
                });
            },
            {
                threshold: 0.3, // تقليل threshold عشان يشتغل أسرع
                rootMargin: '0px 0px -50px 0px'
            }
        );

        observer.observe(this.statsSection.nativeElement);
        console.log('Observer attached to stats section');
    }

    // تشغيل انيميشن العداد
    private startCounterAnimation(): void {
        if (this.hasAnimated) {
            console.log('Animation already started, skipping...');
            return;
        }
        
        console.log('Counter animation started!');
        this.hasAnimated = true;
        
        const stats = this.homeData?.stats || this.defaultStats;
        console.log('Stats to animate:', stats);
        
        // إضافة كلاس الانيميشن للكروت إذا كان القسم موجود
        if (this.statsSection) {
            const statCards = this.statsSection.nativeElement.querySelectorAll('.stat-card');
            console.log('Found stat cards:', statCards.length);
            statCards.forEach((card: HTMLElement) => {
                card.classList.add('counting');
            });
            
            // إزالة كلاس الانيميشن بعد انتهاء العد
            setTimeout(() => {
                statCards.forEach((card: HTMLElement) => {
                    card.classList.remove('counting');
                });
            }, 3000);
        }
        
        // بدء العدادات
        this.animateCounter('completedStudies', stats.completedStudies, 2000);
        this.animateCounter('satisfiedClients', stats.satisfiedClients, 2500);
        this.animateCounter('yearsExperience', stats.yearsExperience, 1500);
        this.animateCounter('successPartners', stats.successPartners, 2200);
    }

    // دالة اختبار العداد
    testCounter(): void {
        console.log('Test counter button clicked!');
        this.hasAnimated = false; // إعادة تعيين العلامة
        this.resetCounters(); // إعادة تعيين العدادات
        setTimeout(() => {
            this.startCounterAnimation();
        }, 100);
    }

    // إعادة تعيين العدادات
    private resetCounters(): void {
        this.animatedStats = {
            completedStudies: 0,
            satisfiedClients: 0,
            yearsExperience: 0,
            successPartners: 0
        };
    }
    // دالة العداد المتحرك - نسخة محسنة
    private animateCounter(property: keyof typeof this.animatedStats, targetValue: number, duration: number): void {
        console.log(`Starting animation for ${property}: 0 → ${targetValue} (${duration}ms)`);
        
        if (targetValue <= 0) {
            console.warn(`Invalid target value for ${property}: ${targetValue}`);
            return;
        }
        
        const startValue = 0;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // استخدام easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            // تحديث القيمة
            this.animatedStats[property] = currentValue;
            
            // طباعة التقدم
            if (Math.floor(progress * 10) !== Math.floor(((elapsed - 16) / duration) * 10)) {
                console.log(`${property}: ${currentValue} (${Math.round(progress * 100)}%)`);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.animatedStats[property] = targetValue;
                console.log(`✅ ${property} completed: ${targetValue}`);
            }
        };
        
        // بدء الانيميشن
        requestAnimationFrame(animate);
        
        // نسخة احتياطية بسيطة
        setTimeout(() => {
            if (this.animatedStats[property] === 0) {
                console.log(`🔄 Using fallback animation for ${property}`);
                let current = 0;
                const step = targetValue / 50;
                const interval = setInterval(() => {
                    current += step;
                    if (current >= targetValue) {
                        current = targetValue;
                        clearInterval(interval);
                        console.log(`🔄 Fallback completed for ${property}: ${targetValue}`);
                    }
                    this.animatedStats[property] = Math.floor(current);
                }, 40);
            }
        }, 1000);
    }
}
