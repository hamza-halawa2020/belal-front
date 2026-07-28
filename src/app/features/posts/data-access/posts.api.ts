import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { Post } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsApi {
    private readonly apiUrl = environment.backEndUrl;

    constructor(private readonly http: HttpClient) { }

    getPosts(page: number = 1): Observable<PaginatedResponse<Post>> {
        return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts?page=${page}`);
    }

    getPost(id: string): Observable<ApiResponse<Post>> {
        return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/posts/${id}`);
    }
}
