import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { InvestmentOpportunity } from '../models/investment-opportunity.model';

@Injectable({
    providedIn: 'root'
})
export class InvestmentOpportunitiesApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getOpportunities(page: number = 1): Observable<PaginatedResponse<InvestmentOpportunity>> {
        return this.http.get<PaginatedResponse<InvestmentOpportunity>>(`${this.apiUrl}/investment-opportunities?page=${page}`);
    }

    getOpportunity(id: string): Observable<ApiResponse<InvestmentOpportunity>> {
        return this.http.get<ApiResponse<InvestmentOpportunity>>(`${this.apiUrl}/investment-opportunities/${id}`);
    }
}
