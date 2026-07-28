import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriesApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getCategories(page: number = 1): Observable<PaginatedResponse<Category>> {
        return this.http.get<PaginatedResponse<Category>>(`${this.apiUrl}/categories?page=${page}`);
    }

    getCategory(id: string): Observable<ApiResponse<Category>> {
        return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`);
    }
}
