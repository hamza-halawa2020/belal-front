import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class InvestmentOpportunitiesService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    getOpportunitiesList(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/investment-opportunities?page=${page}`);
    }

    getOpportunityDetails(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/investment-opportunities/${id}`);
    }
}