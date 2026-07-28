import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/api/api.types';
import { ContactMessagePayload, ContactMessageResult } from '../models/contact-message.model';

@Injectable({
    providedIn: 'root'
})
export class ContactApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    sendMessage(payload: ContactMessagePayload): Observable<ApiResponse<ContactMessageResult>> {
        return this.http.post<ApiResponse<ContactMessageResult>>(`${this.apiUrl}/contacts`, payload);
    }
}
