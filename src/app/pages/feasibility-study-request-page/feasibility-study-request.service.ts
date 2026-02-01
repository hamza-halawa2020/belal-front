import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeasibilityStudyRequestService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    submitRequest(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/feasibility-study-requests`, data);
    }
}