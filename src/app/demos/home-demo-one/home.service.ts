import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MockDataService } from './mock-data.service';

export interface HomeStats {
  completedStudies: number;
  satisfiedClients: number;
  yearsExperience: number;
  successPartners: number;
}

export interface HomeData {
  stats: HomeStats;
  latestWorkSamples: any[];
  teamMembers: any[];
  testimonials: any[];
  latestPosts: any[];
  partners: any[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'https://api.gorhom.com/api';

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  getHomeData(): Observable<HomeData> {
    // محاولة جلب البيانات من API، وفي حالة الفشل استخدام البيانات الوهمية
    return forkJoin({
      workSamples: this.getLatestWorkSamples(),
      teamMembers: this.getTeamMembers(),
      testimonials: this.getTestimonials(),
      posts: this.getLatestPosts(),
      partners: this.getPartners(),
      stats: this.getStats()
    }).pipe(
      map(data => ({
        stats: data.stats,
        latestWorkSamples: data.workSamples,
        teamMembers: data.teamMembers,
        testimonials: data.testimonials,
        latestPosts: data.posts,
        partners: data.partners
      })),
      catchError(error => {
        console.warn('API not available, using mock data:', error);
        return this.mockDataService.getMockHomeData();
      })
    );
  }

  // جلب أحدث نماذج الأعمال (3 عناصر)
  getLatestWorkSamples(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/work-samples?limit=3&sort=created_at:desc`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Work samples API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب أعضاء الفريق (4 عناصر)
  getTeamMembers(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/staff?limit=4&featured=true`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Team members API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب آراء العملاء (3 عناصر)
  getTestimonials(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/reviews?limit=3&rating=5&sort=created_at:desc`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Testimonials API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب أحدث المقالات (3 عناصر)
  getLatestPosts(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/posts?limit=3&sort=created_at:desc`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Posts API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب شركاء النجاح (6 عناصر)
  getPartners(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/success-partners?limit=6&featured=true`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Partners API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب الإحصائيات
  getStats(): Observable<HomeStats> {
    return this.http.get<any>(`${this.apiUrl}/statistics/home`)
      .pipe(
        map(response => ({
          completedStudies: response.data?.completed_studies || 150,
          satisfiedClients: response.data?.satisfied_clients || 500,
          yearsExperience: response.data?.years_experience || 15,
          successPartners: response.data?.success_partners || 50
        })),
        catchError(error => {
          console.warn('Stats API failed, using default values');
          return of({
            completedStudies: 150,
            satisfiedClients: 500,
            yearsExperience: 15,
            successPartners: 50
          });
        })
      );
  }

  // جلب الخدمات الرئيسية (3 عناصر)
  getFeaturedServices(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/services?limit=3&featured=true`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Services API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب دراسات الجدوى المميزة
  getFeaturedFeasibilityStudies(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/feasibility-studies?limit=3&featured=true`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Feasibility studies API failed, using empty array');
          return of([]);
        })
      );
  }

  // جلب الفرص الاستثمارية المميزة
  getFeaturedInvestmentOpportunities(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/investment-opportunities?limit=3&featured=true`)
      .pipe(
        map(response => response.data || []),
        catchError(error => {
          console.warn('Investment opportunities API failed, using empty array');
          return of([]);
        })
      );
  }
}