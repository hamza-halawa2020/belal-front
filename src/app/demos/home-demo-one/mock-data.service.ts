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
        completedStudies: 250,
        satisfiedClients: 800,
        yearsExperience: 20,
        successPartners: 75
      },
      latestWorkSamples: [
        {
          id: 1,
          title: 'دراسة جدوى مشروع مطعم فاخر',
          description: 'دراسة شاملة لمشروع مطعم فاخر في منطقة التجمع الخامس مع تحليل مفصل للسوق والمنافسين والتوقعات المالية',
          image_url: 'assets/images/feasibility-restaurant.jpg',
          created_at: '2024-01-15T10:00:00Z',
          category: 'مطاعم وضيافة',
          investment_amount: 2500000,
          roi_percentage: 35
        },
        {
          id: 2,
          title: 'تحليل فرصة استثمارية في التجارة الإلكترونية',
          description: 'تحليل مفصل لفرصة استثمارية في منصة تجارة إلكترونية متخصصة في المنتجات المحلية مع دراسة المخاطر والعوائد',
          image_url: 'assets/images/ecommerce-study.jpg',
          created_at: '2024-01-12T10:00:00Z',
          category: 'تجارة إلكترونية',
          investment_amount: 1800000,
          roi_percentage: 42
        },
        {
          id: 3,
          title: 'دراسة جدوى مصنع منتجات غذائية',
          description: 'دراسة شاملة لإنشاء مصنع لإنتاج المواد الغذائية المحفوظة مع تحليل السوق والجدوى الاقتصادية',
          image_url: 'assets/images/food-factory-study.jpg',
          created_at: '2024-01-10T10:00:00Z',
          category: 'صناعة غذائية',
          investment_amount: 5000000,
          roi_percentage: 28
        }
      ],
      teamMembers: [
        {
          id: 1,
          name: 'د. أحمد محمد الخبير',
          position: 'مدير دراسات الجدوى الاقتصادية',
          image_url: 'assets/images/team-ahmed.jpg',
          experience_years: 15,
          specialization: 'التحليل الاقتصادي والمالي',
          social_links: {
            linkedin: 'https://linkedin.com/in/ahmed-mohamed-expert',
            twitter: 'https://twitter.com/ahmed_expert'
          }
        },
        {
          id: 2,
          name: 'د. سارة أحمد المالية',
          position: 'خبيرة التحليل المالي والاستثماري',
          image_url: 'assets/images/team-sara.jpg',
          experience_years: 12,
          specialization: 'التحليل المالي وتقييم المخاطر',
          social_links: {
            linkedin: 'https://linkedin.com/in/sara-ahmed-finance',
            twitter: 'https://twitter.com/sara_finance'
          }
        },
        {
          id: 3,
          name: 'م. محمد علي الاستشاري',
          position: 'مستشار استثماري ومطور أعمال',
          image_url: 'assets/images/team-mohamed.jpg',
          experience_years: 18,
          specialization: 'تطوير الأعمال والاستراتيجيات',
          social_links: {
            linkedin: 'https://linkedin.com/in/mohamed-ali-consultant',
            twitter: 'https://twitter.com/mohamed_consultant'
          }
        },
        {
          id: 4,
          name: 'أ. فاطمة حسن المشاريع',
          position: 'مديرة المشاريع والعمليات',
          image_url: 'assets/images/team-fatima.jpg',
          experience_years: 10,
          specialization: 'إدارة المشاريع والعمليات',
          social_links: {
            linkedin: 'https://linkedin.com/in/fatima-hassan-pm',
            twitter: 'https://twitter.com/fatima_pm'
          }
        }
      ],
      testimonials: [
        {
          id: 1,
          client_name: 'خالد أحمد المنصوري',
          client_position: 'رجل أعمال ومستثمر',
          client_image: 'assets/images/client-khalid.jpg',
          comment: 'دراسة جدوى ممتازة وشاملة ساعدتني في اتخاذ القرار الصحيح لمشروع المطعم. الفريق محترف جداً والنتائج كانت دقيقة ومفصلة.',
          rating: 5,
          project_type: 'مطعم فاخر',
          investment_amount: 2500000,
          created_at: '2024-01-20T10:00:00Z'
        },
        {
          id: 2,
          client_name: 'نورا محمد الشريف',
          client_position: 'مديرة تنفيذية ومستثمرة',
          client_image: 'assets/images/client-nora.jpg',
          comment: 'فريق محترف ومتخصص، قدموا لي دراسة جدوى مفصلة لمشروع التجارة الإلكترونية. النتائج فاقت توقعاتي والمشروع نجح بالفعل.',
          rating: 5,
          project_type: 'تجارة إلكترونية',
          investment_amount: 1800000,
          created_at: '2024-01-18T10:00:00Z'
        },
        {
          id: 3,
          client_name: 'عمر حسن الصناعي',
          client_position: 'مستثمر في القطاع الصناعي',
          client_image: 'assets/images/client-omar.jpg',
          comment: 'أنصح بشدة بالتعامل معهم، دراسة الجدوى كانت شاملة ودقيقة. ساعدوني في تجنب مخاطر كثيرة وتحقيق عوائد ممتازة.',
          rating: 5,
          project_type: 'مصنع منتجات غذائية',
          investment_amount: 5000000,
          created_at: '2024-01-16T10:00:00Z'
        }
      ],
      latestPosts: [
        {
          id: 1,
          title: 'دليل شامل لإعداد دراسة جدوى ناجحة في 2024',
          content: 'تعرف على الخطوات الأساسية والمنهجية العلمية لإعداد دراسة جدوى شاملة ومفصلة تضمن نجاح مشروعك الاستثماري',
          excerpt: 'تعرف على الخطوات الأساسية والمنهجية العلمية لإعداد دراسة جدوى شاملة ومفصلة تضمن نجاح مشروعك الاستثماري',
          image_url: 'assets/images/feasibility-guide-2024.jpg',
          author: 'د. أحمد محمد الخبير',
          category: 'دراسات الجدوى',
          read_time: 8,
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          title: 'أفضل الفرص الاستثمارية في السوق المصري لعام 2024',
          content: 'استكشف أهم القطاعات الواعدة والفرص الاستثمارية المربحة في السوق المصري مع تحليل مفصل للمخاطر والعوائد المتوقعة',
          excerpt: 'استكشف أهم القطاعات الواعدة والفرص الاستثمارية المربحة في السوق المصري مع تحليل مفصل للمخاطر والعوائد المتوقعة',
          image_url: 'assets/images/investment-opportunities-2024.jpg',
          author: 'د. سارة أحمد المالية',
          category: 'فرص استثمارية',
          read_time: 12,
          created_at: '2024-01-12T10:00:00Z'
        },
        {
          id: 3,
          title: 'كيفية تقييم المخاطر في المشاريع الاستثمارية',
          content: 'تعلم الأساليب العلمية لتحديد وتقييم وإدارة المخاطر في المشاريع الاستثمارية لضمان اتخاذ قرارات مدروسة ومربحة',
          excerpt: 'تعلم الأساليب العلمية لتحديد وتقييم وإدارة المخاطر في المشاريع الاستثمارية لضمان اتخاذ قرارات مدروسة ومربحة',
          image_url: 'assets/images/risk-assessment-guide.jpg',
          author: 'م. محمد علي الاستشاري',
          category: 'إدارة المخاطر',
          read_time: 10,
          created_at: '2024-01-10T10:00:00Z'
        }
      ],
      partners: [
        {
          id: 1,
          name: 'البنك الأهلي المصري',
          logo_url: 'assets/images/partners/nbe-logo.png',
          description: 'شريك مصرفي استراتيجي',
          website: 'https://www.nbe.com.eg'
        },
        {
          id: 2,
          name: 'غرفة التجارة المصرية',
          logo_url: 'assets/images/partners/chamber-commerce.png',
          description: 'شريك في التطوير التجاري',
          website: 'https://www.fedcoc.org.eg'
        },
        {
          id: 3,
          name: 'الهيئة العامة للاستثمار',
          logo_url: 'assets/images/partners/gafi-logo.png',
          description: 'شريك حكومي للاستثمار',
          website: 'https://www.investinegypt.gov.eg'
        },
        {
          id: 4,
          name: 'اتحاد المستثمرين العرب',
          logo_url: 'assets/images/partners/arab-investors.png',
          description: 'شريك إقليمي للاستثمار',
          website: 'https://www.arabinvestors.org'
        },
        {
          id: 5,
          name: 'مؤسسة التمويل الدولية',
          logo_url: 'assets/images/partners/ifc-logo.png',
          description: 'شريك دولي للتمويل',
          website: 'https://www.ifc.org'
        },
        {
          id: 6,
          name: 'جمعية رجال الأعمال المصريين',
          logo_url: 'assets/images/partners/eba-logo.png',
          description: 'شريك في تطوير الأعمال',
          website: 'https://www.eba.org.eg'
        }
      ]
    };

    // محاكاة تأخير الشبكة
    return of(mockData).pipe(delay(1000));
  }
}