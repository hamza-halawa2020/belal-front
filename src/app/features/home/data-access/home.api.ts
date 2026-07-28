import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StaffMember } from '../../staff/models/staff-member.model';
import { WorkSample } from '../../work-samples/models/work-sample.model';
import {
  HomeApiListResponse,
  HomeData,
  HomeFeaturedFeasibilityStudy,
  HomeFeaturedInvestmentOpportunity,
  HomeFeaturedService,
  HomePartner,
  HomePost,
  HomeRawReview,
  HomeStats,
  HomeSuccessPartner,
  HomeTestimonial
} from '../models/home.model';

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
    return this.http.get<HomeApiListResponse<HomeSuccessPartner>>(`${this.apiUrl}/success-partners`)
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

  getFeaturedServices(): Observable<HomeFeaturedService[]> {
    return this.http.get<HomeApiListResponse<HomeFeaturedService>>(`${this.apiUrl}/services?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getFeaturedFeasibilityStudies(): Observable<HomeFeaturedFeasibilityStudy[]> {
    return this.http.get<HomeApiListResponse<HomeFeaturedFeasibilityStudy>>(`${this.apiUrl}/feasibility-studies?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }

  getFeaturedInvestmentOpportunities(): Observable<HomeFeaturedInvestmentOpportunity[]> {
    return this.http.get<HomeApiListResponse<HomeFeaturedInvestmentOpportunity>>(`${this.apiUrl}/investment-opportunities?limit=3`)
      .pipe(
        map(response => response.data || []),
        catchError(() => {
          return of([]);
        })
      );
  }
}
