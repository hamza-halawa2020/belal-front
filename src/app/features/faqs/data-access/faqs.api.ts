import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/api/api.types';
import { Faq } from '../models/faq.model';

@Injectable({
    providedIn: 'root'
})
export class FaqsApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getFaqs(page: number = 1): Observable<PaginatedResponse<Faq>> {
        return this.http.get<PaginatedResponse<Faq>>(`${this.apiUrl}/faqs?page=${page}`);
    }
}
