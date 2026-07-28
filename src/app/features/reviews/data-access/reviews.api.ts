import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/api/api.types';
import { Review } from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewsApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getReviews(page: number = 1): Observable<PaginatedResponse<Review>> {
        return this.http.get<PaginatedResponse<Review>>(`${this.apiUrl}/reviews?page=${page}`);
    }
}
