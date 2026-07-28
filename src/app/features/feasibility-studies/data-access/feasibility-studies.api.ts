import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { FeasibilityStudy } from '../models/feasibility-study.model';

@Injectable({
    providedIn: 'root'
})
export class FeasibilityStudiesApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getStudies(page: number = 1): Observable<PaginatedResponse<FeasibilityStudy>> {
        return this.http.get<PaginatedResponse<FeasibilityStudy>>(`${this.apiUrl}/feasibility-study?page=${page}`);
    }

    getStudy(id: string): Observable<ApiResponse<FeasibilityStudy>> {
        return this.http.get<ApiResponse<FeasibilityStudy>>(`${this.apiUrl}/feasibility-study/${id}`);
    }
}
