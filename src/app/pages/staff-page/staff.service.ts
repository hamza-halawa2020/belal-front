import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    getStaffList(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/staff?page=${page}`);
    }

    getStaffDetails(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/staff/${id}`);
    }
}