import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { PaginationMeta } from '../../../../core/api/api.types';
import { ContentCardComponent } from '../../../../shared/components/content-card/content-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { canLoadPage, scrollToPageTop } from '../../../../shared/utils/pagination.util';
import { PostsApi } from '../../data-access/posts.api';
import { Post } from '../../models/post.model';

@Component({
    selector: 'app-posts-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TranslateModule, PaginationComponent, ContentCardComponent],
    templateUrl: './posts-list.component.html',
    styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);

    posts: Post[] = [];
    meta: PaginationMeta | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(private readonly postsApi: PostsApi) { }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(page: number = 1): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.postsApi.getPosts(page).pipe(
            finalize(() => {
                this.isLoading = false;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                this.posts = response.data;
                this.meta = response.meta;
                scrollToPageTop();
            },
            error: () => {
                this.posts = [];
                this.meta = null;
                this.errorMessage = 'UNEXPECTED_ERROR';
            }
        });
    }

    onPageChange(page: number): void {
        if (!canLoadPage(this.meta, page)) {
            return;
        }

        this.loadPage(page);
    }
}
