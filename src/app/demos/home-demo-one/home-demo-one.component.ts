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

    defaultStats = {
        completedStudies: 250,
        satisfiedClients: 800,
        yearsExperience: 20,
        successPartners: 75
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
        setTimeout(() => {
            if (this.homeData || !this.isLoading) {
                this.startCounterAnimation();
            }
        }, 1000);
        
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
        // التأكد من أن التقييم رقم صحيح بين 0 و 5
        const validRating = Math.max(0, Math.min(5, Math.floor(rating || 0)));
        return Array(validRating).fill(0);
    }

    // إعداد مراقب التمرير
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
                threshold: 0.3, // تقليل threshold عشان يشتغل أسرع
                rootMargin: '0px 0px -50px 0px'
            }
        );

        observer.observe(this.statsSection.nativeElement);
    }

    // تشغيل انيميشن العداد
    private startCounterAnimation(): void {
        if (this.hasAnimated) {
            return;
        }
        
        this.hasAnimated = true;
        
        const stats = this.homeData?.stats || this.defaultStats;
        
        // إضافة كلاس الانيميشن للكروت إذا كان القسم موجود
        if (this.statsSection) {
            const statCards = this.statsSection.nativeElement.querySelectorAll('.stat-card');
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
        
        if (targetValue <= 0) {
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
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.animatedStats[property] = targetValue;
            }
        };
        
        // بدء الانيميشن
        requestAnimationFrame(animate);
        
        // نسخة احتياطية بسيطة
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
