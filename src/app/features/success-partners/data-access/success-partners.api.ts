import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { SuccessPartner } from '../models/success-partner.model';

@Injectable({
    providedIn: 'root'
})
export class SuccessPartnersApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getPartners(page: number = 1): Observable<PaginatedResponse<SuccessPartner>> {
        return this.http.get<PaginatedResponse<SuccessPartner>>(`${this.apiUrl}/success-partners?page=${page}`);
    }

    getPartner(id: string): Observable<ApiResponse<SuccessPartner>> {
        return this.http.get<ApiResponse<SuccessPartner>>(`${this.apiUrl}/success-partners/${id}`);
    }
}
