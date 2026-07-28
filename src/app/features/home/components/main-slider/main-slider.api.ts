import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MainSliderResponse } from './main-slider.model';

@Injectable({
    providedIn: 'root',
})
export class MainSliderApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getSlides(): Observable<MainSliderResponse> {
        return this.http.get<MainSliderResponse>(`${this.apiUrl}/main-sliders`);
    }
}
