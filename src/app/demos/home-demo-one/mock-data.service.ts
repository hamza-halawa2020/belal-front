import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { HomeData, HomeStats } from './home.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  getMockHomeData(): Observable<HomeData> {
    const mockData: HomeData = {
      stats: {
        completedStudies: 150,
        satisfiedClients: 500,
        yearsExperience: 15,
        successPartners: 50
      },
      latestWorkSamples: [
        {
          id: 1,
          title: 'دراسة جدوى مشروع تجاري',
          description: 'دراسة شاملة لمشروع تجاري في قطاع التجزئة مع تحليل مفصل للسوق والمنافسين',
          image_url: 'assets/images/work-sample-1.jpg',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'تحليل فرصة استثمارية',
          description: 'تحليل مفصل لفرصة استثمارية في القطاع الصناعي مع دراسة المخاطر والعوائد',
          image_url: 'assets/images/work-sample-2.jpg',
          created_at: '2024-01-12T10:00:00Z'
        },
        {
          id: 3,
          title: 'استشارة مالية متخصصة',
          description: 'استشارة شاملة لإعادة هيكلة محفظة استثمارية وتحسين الأداء المالي',
          image_url: 'assets/images/work-sample-3.jpg',
          created_at: '2024-01-10T10:00:00Z'
        }
      ],
      teamMembers: [
        {
          id: 1,
          name: 'أحمد محمد',
          position: 'مدير دراسات الجدوى',
          image_url: 'assets/images/team-1.jpg',
          social_links: {
            linkedin: 'https://linkedin.com/in/ahmed-mohamed',
            twitter: 'https://twitter.com/ahmed_mohamed'
          }
        },
        {
          id: 2,
          name: 'سارة أحمد',
          position: 'خبيرة التحليل المالي',
          image_url: 'assets/images/team-2.jpg',
          social_links: {
            linkedin: 'https://linkedin.com/in/sara-ahmed',
            twitter: 'https://twitter.com/sara_ahmed'
          }
        },
        {
          id: 3,
          name: 'محمد علي',
          position: 'مستشار استثماري',
          image_url: 'assets/images/team-3.jpg',
          social_links: {
            linkedin: 'https://linkedin.com/in/mohamed-ali',
            twitter: 'https://twitter.com/mohamed_ali'
          }
        },
        {
          id: 4,
          name: 'فاطمة حسن',
          position: 'مديرة المشاريع',
          image_url: 'assets/images/team-4.jpg',
          social_links: {
            linkedin: 'https://linkedin.com/in/fatima-hassan',
            twitter: 'https://twitter.com/fatima_hassan'
          }
        }
      ],
      testimonials: [
        {
          id: 1,
          client_name: 'خالد أحمد',
          client_position: 'رجل أعمال',
          client_image: 'assets/images/client-1.jpg',
          comment: 'خدمة ممتازة ودراسة جدوى شاملة ساعدتني في اتخاذ القرار الصحيح لمشروعي',
          rating: 5,
          created_at: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          client_name: 'نورا محمد',
          client_position: 'مديرة تنفيذية',
          client_image: 'assets/images/client-2.jpg',
          comment: 'فريق محترف ومتخصص، قدموا لي استشارة مالية ممتازة وساعدوني في تطوير استثماراتي',
          rating: 5,
          created_at: '2024-01-18T10:00:00Z'
        },
        {
          id: 3,
          client_name: 'عمر حسن',
          client_position: 'مستثمر',
          client_image: 'assets/images/client-3.jpg',
          comment: 'أنصح بشدة بالتعامل معهم، خدمة عملاء ممتازة ونتائج مضمونة',
          rating: 5,
          created_at: '2024-01-16T10:00:00Z'
        }
      ],
      latestPosts: [
        {
          id: 1,
          title: 'كيفية إعداد دراسة جدوى ناجحة',
          content: 'تعرف على الخطوات الأساسية لإعداد دراسة جدوى شاملة ومفصلة لمشروعك',
          excerpt: 'تعرف على الخطوات الأساسية لإعداد دراسة جدوى شاملة ومفصلة لمشروعك',
          image_url: 'assets/images/post-1.jpg',
          author: 'أحمد محمد',
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'أفضل الفرص الاستثمارية لعام 2024',
          content: 'استكشف أهم الفرص الاستثمارية الواعدة في الأسواق المحلية والعالمية',
          excerpt: 'استكشف أهم الفرص الاستثمارية الواعدة في الأسواق المحلية والعالمية',
          image_url: 'assets/images/post-2.jpg',
          author: 'سارة أحمد',
          created_at: '2024-01-12T10:00:00Z'
        },
        {
          id: 3,
          title: 'نصائح للاستثمار الآمن',
          content: 'تعلم كيفية تقليل المخاطر وزيادة العوائد في استثماراتك',
          excerpt: 'تعلم كيفية تقليل المخاطر وزيادة العوائد في استثماراتك',
          image_url: 'assets/images/post-3.jpg',
          author: 'محمد علي',
          created_at: '2024-01-10T10:00:00Z'
        }
      ],
      partners: [
        {
          id: 1,
          name: 'شريك 1',
          logo_url: 'assets/images/partner-1.png'
        },
        {
          id: 2,
          name: 'شريك 2',
          logo_url: 'assets/images/partner-2.png'
        },
        {
          id: 3,
          name: 'شريك 3',
          logo_url: 'assets/images/partner-3.png'
        },
        {
          id: 4,
          name: 'شريك 4',
          logo_url: 'assets/images/partner-4.png'
        },
        {
          id: 5,
          name: 'شريك 5',
          logo_url: 'assets/images/partner-5.png'
        },
        {
          id: 6,
          name: 'شريك 6',
          logo_url: 'assets/images/partner-6.png'
        }
      ]
    };

    // محاكاة تأخير الشبكة
    return of(mockData).pipe(delay(1000));
  }
}