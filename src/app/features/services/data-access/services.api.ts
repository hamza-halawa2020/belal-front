import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { Service } from '../models/service.model';

@Injectable({
    providedIn: 'root'
})
export class ServicesApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getServices(page: number = 1): Observable<PaginatedResponse<Service>> {
        return this.http.get<PaginatedResponse<Service>>(`${this.apiUrl}/services?page=${page}`);
    }

    getService(id: string): Observable<ApiResponse<Service>> {
        return this.http.get<ApiResponse<Service>>(`${this.apiUrl}/services/${id}`);
    }
}
