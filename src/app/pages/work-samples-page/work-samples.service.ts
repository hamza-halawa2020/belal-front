import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class WorkSamplesService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    // Get all work samples with pagination support
    getWorkSamplesList(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/work-samples?page=${page}`);
    }

    // Get single work sample details by ID
    getWorkSampleDetails(id: number | string): Observable<any> {
        return this.http.get(`${this.apiUrl}/work-samples/${id}`);
    }
}
