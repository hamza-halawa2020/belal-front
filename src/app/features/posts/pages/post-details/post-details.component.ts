import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, finalize, map, switchMap } from 'rxjs';
import { ImageFallbackDirective } from '../../../../shared/directives/image-fallback.directive';
import { getStoredImageUrl } from '../../../../shared/utils/image-url.util';
import { PostsApi } from '../../data-access/posts.api';
import { Post } from '../../models/post.model';

@Component({
    selector: 'app-post-details',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, ImageFallbackDirective],
    templateUrl: './post-details.component.html',
    styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    post: Post | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly route: ActivatedRoute,
        private readonly postsApi: PostsApi
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            map(params => params.get('id')),
            filter((id): id is string => Boolean(id)),
            switchMap(id => {
                this.isLoading = true;
                this.errorMessage = '';

                return this.postsApi.getPost(id).pipe(
                    finalize(() => {
                        this.isLoading = false;
                    })
                );
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.post = response.data;
            },
            error: () => {
                this.post = null;
                this.errorMessage = 'UNEXPECTED_ERROR';
            }
        });
    }

    getImageUrl(post: Post): string {
        return getStoredImageUrl(post.image_url, post.image);
    }
}
