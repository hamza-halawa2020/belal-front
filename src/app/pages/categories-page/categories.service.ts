import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private apiUrl = environment.backEndUrl;

    constructor(private http: HttpClient) { }

    getCategoriesList(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/categories?page=${page}`);
    }

    getCategoryDetails(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/categories/${id}`);
    }
}