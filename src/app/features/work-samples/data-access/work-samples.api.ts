import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { WorkSample } from '../models/work-sample.model';

@Injectable({
    providedIn: 'root'
})
export class WorkSamplesApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getWorkSamples(page: number = 1): Observable<PaginatedResponse<WorkSample>> {
        return this.http.get<PaginatedResponse<WorkSample>>(`${this.apiUrl}/work-samples?page=${page}`);
    }

    getWorkSample(id: string): Observable<ApiResponse<WorkSample>> {
        return this.http.get<ApiResponse<WorkSample>>(`${this.apiUrl}/work-samples/${id}`);
    }
}
