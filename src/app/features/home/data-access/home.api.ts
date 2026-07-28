import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { FeasibilityStudy } from '../../feasibility-studies/models/feasibility-study.model';
import { InvestmentOpportunity } from '../../investment-opportunities/models/investment-opportunity.model';
import { Service } from '../../services/models/service.model';
import { StaffMember } from '../../staff/models/staff-member.model';
import { SuccessPartner } from '../../success-partners/models/success-partner.model';
import { WorkSample } from '../../work-samples/models/work-sample.model';

export interface HomeStats {
  completedStudies: number;
  satisfiedClients: number;
  yearsExperience: number;
  successPartners: number;
}

export interface HomeData {
  stats: HomeStats;
  latestWorkSamples: WorkSample[];
  teamMembers: StaffMember[];
  testimonials: HomeTestimonial[];
  latestPosts: HomePost[];
  partners: HomePartner[];
}

interface HomeApiListResponse<T> {
  data?: T[];
}

export interface HomeTestimonial {
  id: number;
  client_name: string;
  comment: string;
  status?: string;
  created_at?: string;
  rating?: number;
}

interface HomeRawReview {
  id: number;
  name: string;
  review: string;
  status?: string;
  created_at?: string;
  rating?: number;
}

export interface HomePost {
  id: number;
  title: string;
  description?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  image_url?: string;
  created_at?: string;
}

export interface HomePartner {
  id: number;
  name: string;
  logo_url?: string;
  link?: string | null;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeApi {
  private readonly apiUrl = environment.backEndUrl;

  constructor(
    private readonly http: HttpClient,
  ) {}


  getHomeData(): Observable<HomeData> {
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

    );
  }

  getLatestWorkSamples(): Observable<WorkSample[]> {
    return this.http.get<HomeApiListResponse<WorkSample>>(`${this.apiUrl}/work-samples?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getTeamMembers(): Observable<StaffMember[]> {
    return this.http.get<HomeApiListResponse<StaffMember>>(`${this.apiUrl}/staff?limit=4`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getTestimonials(): Observable<HomeTestimonial[]> {
    return this.http.get<HomeApiListResponse<HomeRawReview>>(`${this.apiUrl}/reviews?limit=3`)
      .pipe(
        map(response => {
          const reviews = response.data || [];
          return reviews.map((review: HomeRawReview) => ({
            id: review.id,
            client_name: review.name,
            comment: review.review,
            status: review.status,
            created_at: review.created_at,
            rating: review.rating
          }));
        }),
        catchError(() => {
          return of([]);
        })
      );
  }

  getLatestPosts(): Observable<HomePost[]> {
    return this.http.get<HomeApiListResponse<HomePost>>(`${this.apiUrl}/posts?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getPartners(): Observable<HomePartner[]> {
    return this.http.get<HomeApiListResponse<SuccessPartner & { status?: string }>>(`${this.apiUrl}/success-partners`)
      .pipe(
        map(response => {
          const partners = response.data || [];
          return partners.map(partner => ({
            id: partner.id,
            name: partner.name,
            logo_url: partner.image_url,
            link: partner.link,
            status: partner.status
          }));
        }),
        catchError(() => {
          return of([]);
        })
      );
  }

  getStats(): Observable<HomeStats> {
    return of({
      completedStudies: 250,
      satisfiedClients: 800,
      yearsExperience: 20,
      successPartners: 75
    });
  }

  getFeaturedServices(): Observable<Service[]> {
    return this.http.get<HomeApiListResponse<Service>>(`${this.apiUrl}/services?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getFeaturedFeasibilityStudies(): Observable<FeasibilityStudy[]> {
    return this.http.get<HomeApiListResponse<FeasibilityStudy>>(`${this.apiUrl}/feasibility-studies?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getFeaturedInvestmentOpportunities(): Observable<InvestmentOpportunity[]> {
    return this.http.get<HomeApiListResponse<InvestmentOpportunity>>(`${this.apiUrl}/investment-opportunities?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }
}
