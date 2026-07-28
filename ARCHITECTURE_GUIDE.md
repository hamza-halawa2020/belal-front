# Architecture Guide

This document defines the preferred architecture and coding rules for this Angular project. Its main goal is to keep human developers and AI coding tools working with the same structure, naming, and implementation patterns.

## Current Project Shape

The project is an Angular standalone application. It currently uses this broad structure:

```txt
src/app
  core/
  common/
  features/
  shared/
```

The project has been migrated to a feature-based structure:

- `core/` contains app-wide singleton code, shared API response types, interceptors, and app-level pages.
- `features/` contains business domains, each with its own route file, pages, models, and data-access API service.
- `shared/` contains reusable typed UI components.
- `common/` is limited to app shell/shared layout components such as navbar, footer, back-to-top, and WhatsApp floating action.
- The old top-level `pages/` and `demos/` folders have been removed.
- API responses are typed with `ApiResponse<T>`, `PaginatedResponse<T>`, and feature-specific models.

## Main Architecture Problems

### 1. Keep Avoiding `any`

The project has been cleaned from common `any` API patterns. Keep this rule strict for all new code. Avoid:

```ts
Observable<any>
items: any[]
meta: any
```

Using `any` makes the code harder to refactor and makes AI tools guess the API shape instead of following a clear contract.

### 2. Keep API Services Consistent

Feature API services should keep one consistent pattern:

```ts
getItemsList(page: number = 1)
getItemDetails(id: string)
```

The pattern is now typed and should stay inside `features/{feature}/data-access/`.

### 3. Keep Component State Consistent

List pages commonly repeat:

```ts
items = [];
meta = null;
isLoading = true;
subscribe(...)
window.scrollTo(...)
```

This should stay standardized so every list page behaves the same way.

### 4. Environment Imports Are Not Consistent

Some files import:

```ts
import { environment } from '../../../environments/environment.development';
```

This should be avoided. Always import:

```ts
import { environment } from '../../../environments/environment';
```

Angular replaces environment files based on the active build configuration.

### 5. Form Logic Is Duplicated

Forms repeat validation, translated messages, server error parsing, and timeout-based message clearing. This should eventually move into shared helpers or a form utility service.

### 6. Feature Routes Are Required

Each feature should own its own route file. `app.routes.ts` should only compose lazy-loaded feature routes and app-level fallbacks.

### 7. Avoid Legacy Global Scripts

The project should avoid global JavaScript assets, especially jQuery-based scripts. Use Angular components, directives, or framework-native packages instead.
Legacy template scripts should not be kept in `src/assets/js` as passive files because they are still copied to production assets and can confuse future maintenance.
The same rule applies to old CSS files under `src/assets/css` when they are no longer referenced by `angular.json` or application code.

## Target Architecture

Use a feature-based architecture:

```txt
src/app
  core/
    api/
      api-client.service.ts
      api.types.ts
    config/
    interceptors/
    services/

  shared/
    components/
    directives/
    pipes/
    utils/
    models/

  features/
    posts/
      data-access/
        posts.api.ts
      models/
        post.model.ts
      pages/
        posts-list/
        post-details/
      posts.routes.ts

    services/
      data-access/
        services.api.ts
      models/
        service.model.ts
      pages/
        services-list/
        service-details/
      services.routes.ts

    categories/
    contact/
    staff/
    reviews/
```

## Folder Responsibilities

### `core/`

Use `core/` for application-wide singleton code.

Examples:

- HTTP interceptors
- API client wrappers
- global config
- auth/token helpers
- global error handling
- app-level services

Rules:

- `core/` should not contain page components.
- `core/` should not depend on feature folders.
- `core/` can be imported by features and shared code.

### `shared/`

Use `shared/` for reusable UI and utilities that do not belong to one business feature.

Examples:

- pagination component
- content card component
- pipes
- directives
- generic models
- generic helpers

Rules:

- `shared/` must not contain business API services.
- `shared/` must not depend on feature folders.
- Shared components should be typed and configurable through inputs/outputs.

### `features/`

Use `features/` for business domains.

Examples:

- posts
- services
- categories
- investment opportunities
- feasibility studies
- contact
- staff
- reviews

Each feature should own:

- its pages
- its API access service
- its models
- its route definitions, when needed

## API Response Types

Create shared API types in:

```txt
src/app/core/api/api.types.ts
```

Recommended types:

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}
```

All API services should return typed observables:

```ts
getPosts(page = 1): Observable<PaginatedResponse<Post>>;
getPost(id: string): Observable<ApiResponse<Post>>;
```

Avoid:

```ts
Observable<any>
```

## Feature Model Pattern

Each feature should define its own models.

Example:

```txt
src/app/features/posts/models/post.model.ts
```

```ts
export interface Post {
  id: number;
  title: string;
  description?: string;
  image?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}
```

Do not create huge global model files. Keep models close to their feature unless they are truly shared.

## API Service Pattern

Feature API services should live in:

```txt
src/app/features/{feature}/data-access/{feature}.api.ts
```

Example:

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/api/api.types';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsApi {
  private readonly apiUrl = environment.backEndUrl;

  constructor(private readonly http: HttpClient) {}

  getPosts(page = 1): Observable<PaginatedResponse<Post>> {
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/posts?page=${page}`);
  }

  getPost(id: string): Observable<ApiResponse<Post>> {
    return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/posts/${id}`);
  }
}
```

Rules:

- API services should only call the backend and return typed observables.
- API services should not control UI loading state.
- API services should not show messages.
- API services should not call `window`, `document`, or router navigation unless there is a strong reason.

## List Page Pattern

List pages should follow one consistent state pattern:

```ts
items: Post[] = [];
meta: PaginationMeta | null = null;
isLoading = false;
errorMessage = '';
```

Recommended implementation:

```ts
loadPage(page = 1): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.postsApi.getPosts(page).pipe(
    finalize(() => {
      this.isLoading = false;
    })
  ).subscribe({
    next: response => {
      this.items = response.data;
      this.meta = response.meta;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    error: () => {
      this.errorMessage = 'Failed to load data.';
    }
  });
}
```

Rules:

- Use `finalize()` for loading state.
- Use `takeUntilDestroyed()` for component subscriptions.
- Keep pagination state typed.
- Do not duplicate pagination page-number calculation inside pages. Use the shared pagination component.
- Use `canLoadPage(meta, page)` for pagination guards.
- Use `scrollToPageTop()` after successful page loads.

## Details Page Pattern

Details pages should follow one consistent state pattern:

```ts
item: Post | null = null;
isLoading = false;
errorMessage = '';
```

Recommended implementation:

```ts
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
    })
  ).subscribe({
    next: response => {
      this.item = response.data;
    },
    error: () => {
      this.errorMessage = 'Failed to load details.';
    }
  });
}
```

## Form Page Pattern

Forms should follow one consistent state pattern:

```ts
form: FormGroup;
isSubmitting = false;
successMessage = '';
errorMessage = '';
```

Rules:

- Validate before submit.
- Mark all controls as touched when invalid.
- Define a typed payload model for every form before calling the API.
- API submit methods must accept typed payloads and return typed responses.
- Avoid nested `subscribe()` calls. Prefer `instant()` for simple translated messages, or use RxJS operators when async translation is required.
- Use `finalize()` for submit loading state.
- Use `takeUntilDestroyed()` for submit subscriptions.
- Parse backend validation errors in one helper.
- Avoid repeating `setTimeout` message-clearing logic in every component.
- Use `showTransientMessage()` and `clearTransientMessage()` for temporary success/error messages.

Recommended future helper:

```txt
src/app/shared/utils/api-error-message.util.ts
```

Use `getApiErrorMessage(error, fallbackMessage)` to parse backend validation errors consistently.
Use `showTransientMessage()` and `clearTransientMessage()` from `src/app/shared/utils/transient-message.util.ts` for temporary success/error messages.

Temporary form messages should use:

```txt
src/app/shared/utils/transient-message.util.ts
```

## Routing Pattern

Each feature must define routes close to the feature:

```txt
src/app/features/posts/posts.routes.ts
```

Example:

```ts
import { Routes } from '@angular/router';

export const postsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/posts-list/posts-list.component').then(m => m.PostsListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/post-details/post-details.component').then(m => m.PostDetailsComponent)
  }
];
```

Then lazy-load the route file from `app.routes.ts`:

```ts
{
  path: 'posts',
  loadChildren: () => import('./features/posts/posts.routes').then(m => m.postsRoutes)
}
```

## Environment Rule

Always import:

```ts
import { environment } from 'src/environments/environment';
```

or with the correct relative path:

```ts
import { environment } from '../../../../environments/environment';
```

Never import:

```ts
environment.development
```

Application code should not decide which environment file is active. Angular build configuration should handle that.

## Local Development Notes

- Prefer a Node.js LTS version for local development and production builds.
- The project currently builds and serves successfully, but odd-numbered Node.js versions show a warning and should not be used for production.
- If the dev server reports a PostCSS/Vite config parsing error under `.angular/vite-root`, first restart the dev server.
- If the error persists, clear Angular's local cache and rebuild before changing application code.
- Avoid running multiple Angular dev/build/watch processes against the same `dist/` or cache folders because it can cause transient file locks on Windows.

## Styling Rules

- Keep global CSS only for global theme, vendor styles, and legacy template styles.
- Keep global CSS minimal; do not add large template CSS files under `src/assets/css`.
- Component-specific styles should stay in the component SCSS file.
- Do not add jQuery plugins or global scripts for Angular features.
- Do not keep unused legacy JavaScript files under `src/assets/js`.
- Do not keep unused legacy CSS files under `src/assets/css`.
- Prefer Angular components and directives over manual DOM manipulation.
- Reuse shared components before creating new duplicated UI.

## UI/UX Direction

The website should feel simple, calm, and easy for users to scan. Avoid heavy visual treatments, oversized typography, large spacing, and decorative UI that does not help the user complete an action.

Global UI tuning is currently applied in:

```txt
src/styles.scss
```

The current direction is:

- Use small, readable font sizes.
- Use a simple system font stack.
- Keep headings clear but not oversized.
- Keep section spacing moderate.
- Keep buttons compact and easy to recognize.
- Keep cards simple with light borders and soft shadows.
- Show content images fully with `object-fit: contain` by default; use `cover` only when the crop is intentional, such as a decorative background.
- Image fallbacks must point to real files under `src/assets`; do not reference demo placeholder filenames that are not committed.
- Keep forms clean, readable, and focused.
- Avoid visual clutter, large decorative elements, and unnecessary animation.
- Do not use global animation libraries for basic page reveals; `animate.css` was removed to keep the UI lighter and calmer.
- Do not add custom cursor effects or decorative pointer animations; keep the native browser cursor.
- Respect `prefers-reduced-motion` and keep transitions short and subtle.
- Prioritize readability, fast scanning, and clear actions.
- Make the mobile experience compact and comfortable.

When an AI tool edits UI, it must preserve this direction. New UI should look lightweight and practical, not like a heavy marketing template.

## Naming Rules

Use consistent names:

```txt
features/posts/data-access/posts.api.ts
features/posts/models/post.model.ts
features/posts/pages/posts-list/posts-list.component.ts
features/posts/pages/post-details/post-details.component.ts
```

Class names:

```ts
PostsApi
PostsListComponent
PostDetailsComponent
Post
```

Method names:

```ts
getPosts()
getPost(id)
createPost(payload)
updatePost(id, payload)
deletePost(id)
```

Avoid mixing names like:

```ts
getPostsList()
getPostDetails()
index()
store()
```

Pick one style per layer.

## AI Coding Rules

Any AI tool working on this project must follow these rules:

The short operational checklist for AI agents lives in:

```txt
AGENTS.md
```

- Use Angular standalone components only.
- New business code must live under `src/app/features/{feature-name}`.
- API calls must live under `data-access/`.
- Feature models must live under `models/`.
- Do not use `any` unless there is a documented reason.
- Forms must submit typed payload objects, not raw untyped `any` values.
- Use `ApiResponse<T>` and `PaginatedResponse<T>` for backend responses.
- Always import `environment`, never `environment.development`.
- Use `finalize()` for loading and submitting state.
- Do not duplicate pagination logic in page components.
- Reuse `PaginationComponent` for paginated lists.
- Reuse `ContentCardComponent` only when its inputs match the data model clearly.
- Do not build image URLs manually in page components.
- Do not add new global scripts, jQuery plugins, or direct DOM manipulation for new features.
- Keep components focused on UI state and user interaction.
- Keep API services focused on HTTP calls.
- Keep route definitions close to their feature when the feature grows.
- Do not refactor unrelated features while implementing a specific task.

## Migration Status

### Completed

- Created `src/app/core/api/api.types.ts`.
- Moved `token.interceptor.ts` into `src/app/core/interceptors/`.
- Added common API response interfaces.
- Fixed application environment imports to use `environment`.
- Migrated business domains into `src/app/features`.
- Added feature route files and lazy-loaded them from `app.routes.ts`.
- Removed old top-level `pages/` and `demos/` folders.
- Removed unused legacy `common` components and empty folders.
- Typed shared pagination and content card components.
- Removed common `any` API patterns from `src/app`.
- Applied global lightweight UI/UX tuning in `src/styles.scss`.
- Removed legacy jQuery/global script entries from `angular.json`.
- Removed unused legacy JavaScript assets from `src/assets/js`.
- Removed unused legacy CSS assets from `src/assets/css`.
- Removed `animate.css` and old reveal-animation classes from page templates.
- Removed demo placeholder image CSS and replaced broken home fallback image paths with existing assets.
- Removed the old global template stylesheet from `src/assets/css/style.css`; the app now relies on vendor CSS, `src/styles.scss`, and component SCSS.
- Removed the unused `magnific-popup` dependency from project manifests.
- Production build succeeds with `npm.cmd run build`.

### Next Improvement Areas

- Continue using and extending `src/app/shared/utils/api-error-message.util.ts` for backend form errors.
- Use `src/app/shared/utils/image-url.util.ts` when an API can return either `image_url` or an `image` filename.
- Use `src/app/shared/utils/pagination.util.ts` for pagination guards and page scroll behavior.
- Use Angular `DestroyRef` with `takeUntilDestroyed()` for component-owned subscriptions.
- Apply the same subscription cleanup rule in `features/`, `common/`, `shared/`, and `core`.
- Use `styleUrls` consistently for component stylesheet metadata.
- Continue simplifying component SCSS where legacy template styles are still too heavy.
- Keep `angular.json` scripts empty unless there is a reviewed, documented reason.
- Keep `src/assets/js` empty unless a reviewed static asset requires it.
- Keep passive CSS assets out of `src/assets/css`; add styles through `angular.json` or component SCSS intentionally.
- Add linting rules or AI instructions that block `any`, `environment.development`, and new files outside the agreed architecture.

## Recommended First Refactor

Start with the `posts` feature because it is simple and representative:

```txt
src/app/features/posts
  data-access/
    posts.api.ts
  models/
    post.model.ts
  pages/
    posts-list/
    post-details/
  posts.routes.ts
```

After that, use `posts` as the reference pattern for:

- services
- categories
- work samples
- feasibility studies
- investment opportunities
- staff
- partners
- reviews

## Definition Of Done For New Features

A new feature is considered complete only when:

- It lives under `src/app/features/{feature-name}`.
- It has typed models.
- Its API service returns typed observables.
- It does not use `any`.
- It handles loading, success, and error states.
- It uses shared components where appropriate.
- It imports `environment`, not `environment.development`.
- It builds successfully with `npm run build`.
