import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/api/api.types';
import { StaffMember } from '../models/staff-member.model';

@Injectable({
    providedIn: 'root'
})
export class StaffApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getStaff(page: number = 1): Observable<PaginatedResponse<StaffMember>> {
        return this.http.get<PaginatedResponse<StaffMember>>(`${this.apiUrl}/staff?page=${page}`);
    }
}
