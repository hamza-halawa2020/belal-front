# AI Agent Instructions

Follow these rules when editing this Angular project. For full context, read `ARCHITECTURE_GUIDE.md`.

## Project Shape

```txt
src/app
  core/      singleton app code, interceptors, API types
  common/    app shell/layout components only
  features/  business features
  shared/    reusable components and utilities
```

## Required Patterns

- Use Angular standalone components.
- Put new business code under `src/app/features/{feature-name}`.
- Put API services in `data-access/`.
- Put feature models in `models/`.
- Put feature routes in `{feature-name}.routes.ts`.
- Lazy-load features from `src/app/app.routes.ts`.
- Use `ApiResponse<T>` and `PaginatedResponse<T>` from `src/app/core/api/api.types.ts`.
- Avoid `any`.
- Import `environment`, never `environment.development`.
- Use `finalize()` for loading/submitting state.
- Use `DestroyRef` with `takeUntilDestroyed()` for component subscriptions.
- Use `canLoadPage()` and `scrollToPageTop()` from `src/app/shared/utils/pagination.util.ts`.
- Use `getStoredImageUrl()` from `src/app/shared/utils/image-url.util.ts`.
- Use `getApiErrorMessage()` from `src/app/shared/utils/api-error-message.util.ts`.
- Use `showTransientMessage()` and `clearTransientMessage()` for temporary form messages.
- Guard browser-only APIs with `isPlatformBrowser()` or shared utilities.

## UI Direction

- Keep the UI simple, readable, compact, and easy to scan.
- Use small, comfortable font sizes.
- Avoid oversized headings, heavy decoration, visual clutter, and unnecessary animation.
- Keep forms clear and focused.
- Show content images fully with `object-fit: contain` by default; use `cover` only for intentional decorative cropping.
- Image fallbacks must point to real committed files under `src/assets`.
- Use `ImageFallbackDirective` for API-driven images.
- Preserve mobile readability.

## Do Not

- Do not recreate old `pages/` or `demos/` folders.
- Do not put business API services in `common/` or `shared/`.
- Do not build image URLs manually in components or templates.
- Do not add new jQuery/global scripts for Angular features.
- Do not add large template CSS files under `src/assets/css`; use `src/styles.scss` for small global rules and component SCSS for UI.
- Do not introduce broad refactors while solving a narrow task.

## Verification

Run at least:

```bash
npm.cmd run build
```

For UI, SEO, accessibility, or performance changes, run the dev server first and then:

```bash
npm.cmd run lighthouse
```

Prefer `npm.cmd run lighthouse:prod` for performance baselines because it measures a production build instead of the Angular dev server.

Lighthouse requires Chrome and a Node.js command available in the terminal PATH.

For test-related changes, also run:

```bash
npm.cmd test -- --watch=false --browsers=ChromeHeadless
```
