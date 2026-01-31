import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ServicesService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    // Get all services
    // Get all services
    getServicesList(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/services?page=${page}`);
    }

    // Get single service details by ID
    getServiceDetails(id: number | string): Observable<any> {
        return this.http.get(`${this.apiUrl}/services/${id}`);
    }
}
