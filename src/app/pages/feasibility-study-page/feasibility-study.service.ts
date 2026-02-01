import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FeasibilityStudyService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    getStudiesList(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/feasibility-study?page=${page}`);
    }

    getStudyDetails(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/feasibility-study/${id}`);
    }
}
