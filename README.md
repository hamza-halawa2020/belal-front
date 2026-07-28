# Belal Frontend

Angular standalone frontend for the Belal website.

## Quick Start

```bash
npm install
npm start
```

Local development server:

```txt
http://localhost:4200/
```

If port `4200` is already in use, run:

```bash
npm start -- --port 4300
```

## Useful Commands

```bash
npm.cmd run build
npm.cmd test -- --watch=false --browsers=ChromeHeadless
```

Use a Node.js LTS version when possible. Odd-numbered Node versions can work locally, but they are not recommended for production.

## Project Structure

```txt
src/app
  core/      app-wide singleton code, interceptors, API types
  common/    app shell/layout components
  features/  business features, pages, routes, models, API services
  shared/    reusable components and utilities
```

## Architecture Rules

- New business code goes under `src/app/features/{feature-name}`.
- API services live in `data-access/`.
- Feature models live in `models/`.
- Routes should stay close to their feature and be lazy-loaded from `app.routes.ts`.
- Avoid `any`.
- Use typed API responses from `src/app/core/api/api.types.ts`.
- Import `environment`, not `environment.development`.
- Use `DestroyRef` with `takeUntilDestroyed()` for component subscriptions.
- Keep UI simple, readable, compact, and easy to scan.

Read the full project rules in [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md).

AI coding tools should also read [AGENTS.md](./AGENTS.md) before making changes.
