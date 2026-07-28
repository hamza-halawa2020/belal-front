import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/api/api.types';
import { FeasibilityStudyRequestPayload, FeasibilityStudyRequestResult } from '../models/feasibility-study-request.model';

@Injectable({
    providedIn: 'root'
})
export class FeasibilityStudyRequestsApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    submitRequest(payload: FeasibilityStudyRequestPayload): Observable<ApiResponse<FeasibilityStudyRequestResult>> {
        return this.http.post<ApiResponse<FeasibilityStudyRequestResult>>(`${this.apiUrl}/feasibility-study-requests`, payload);
    }
}
