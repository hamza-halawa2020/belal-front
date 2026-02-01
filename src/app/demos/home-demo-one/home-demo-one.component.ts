import { Component, OnInit } from '@angular/core';
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
export class HomeDemoOneComponent implements OnInit {
    homeData: HomeData | null = null;
    isLoading = true;
    error: string | null = null;

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

    loadHomeData(): void {
        this.isLoading = true;
        this.error = null;

        this.homeService.getHomeData().subscribe({
            next: (data) => {
                this.homeData = data;
                this.isLoading = false;
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
}
