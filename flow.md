# Frontend runtime and verification flow

This document describes how the Vite + vanilla JS client boots, routes by hash, composes the home page, and calls the Express backend API. There is no React Router or server-side HTML routing in this repository.

## Bootstrap

1. `index.html` defines `<div id="app"></div>` and loads `/src/main.js` as an ES module.
2. `src/main.js` selects `#app`, defines `API_BASE` from `import.meta.env.VITE_API_BASE` (default `http://localhost:3008`), registers a `hashchange` listener, and calls `renderRoute()` on load.

```mermaid
flowchart LR
  index[index.html] --> main[src/main.js]
  main --> renderRoute[renderRoute]
  renderRoute --> getRoute[getRoute from location.hash]
```

## Client routing (hash only)

`getRoute()` reads `window.location.hash`, strips `#` and an optional leading `/`, and returns one of:

| Hash examples | Route name | Mount function |
| --- | --- | --- |
| (empty), `#`, `#/` | `home` | `mountHomePage()` |
| `#/count-characters`, `#count-characters` | `count-characters` | `mountCountCharactersPage(app)` |
| `#/todaydatetime`, `#todaydatetime` | `todaydatetime` | `mountTodayDateTimePage(app)` |
| `#/power`, `#power` | `power` | `mountPowerCalculator(app)` |

`renderRoute()` clears `#app` with `innerHTML = ''` for non-home routes, then mounts the matching page module. For `home`, it calls `mountHomePage()` without a prior full clear inside `renderRoute` (see home composition below).

## Home page composition

`mountHomePage()`:

1. Sets `app.innerHTML = ''` once to reset the shell.
2. Inserts the home nav at the top via `insertAdjacentHTML('afterbegin', …)` with a link to `#/todaydatetime`.
3. Calls multiple mount helpers on the same `#app` element:
   - `mountHealthStatus(app)` — appends health UI with `insertAdjacentHTML('beforeend', …)`, then `GET /health` and renders `status`.
   - `mountUserList(app)` — appends users section, then `GET /api/users` and renders each user `name`.
   - `mountPlusCalculator(app)`, `mountMinusCalculator(app)`, `mountMultiplyCalculator(app)`, `mountDivideCalculator(app)` — each appends its section with `insertAdjacentHTML('beforeend', …)` (replacing only by appending, not wiping siblings).
   - `mountFactorialCalculator(app)` — appends with `insertAdjacentHTML('beforeend', …)` (same append pattern as the other calculators on home).

Dedicated hash routes (`count-characters`, `todaydatetime`, `power`) replace the entire `#app` contents via `innerHTML = ''` before mounting a single full-page module.

## Client fetch catalog

All requests use `fetch(\`${API_BASE}<path>\`, …)` with JSON where noted. Response field names match the backend contract exactly.

| UI module | Method | Path | Request JSON fields | Response JSON fields |
| --- | --- | --- | --- | --- |
| `mountHealthStatus` (`src/main.js`) | GET | `/health` | — | `status` |
| `mountUserList` (`UserListPage.js`) | GET | `/api/users` | — | array of `{ id, name }` |
| `mountPlusCalculator` | POST | `/plus` | `a`, `b` | `result` |
| `mountMinusCalculator` | POST | `/minus` | `a`, `b` | `result`, `error` (400) |
| `mountMultiplyCalculator` | POST | `/multiply` | `a`, `b` | `result`, `error` (400) |
| `mountDivideCalculator` | POST | `/divide` | `a`, `b` | `result`, `error` (400) |
| `mountFactorialCalculator` | POST | `/factorial` | `n` | `result`, `error` (400) |
| `mountCountCharactersPage` | POST | `/count-characters` | `text` | `count`, `error` (400) |
| `mountTodayDateTimePage` | GET | `/todaydatetime` | — | `datetime` |
| `mountPowerCalculator` | POST | `/power` | `a`, `b` | `result`, `error` (400) |

## Vite dev workflow

- Start the backend on port **3008** (separate `testing-ai-agent` repo).
- From this repo: `npm run dev` — Vite serves the client on **http://localhost:5173**.
- `vite.config.js` proxies these paths to `http://localhost:3008`: `/health`, `/api`, `/plus`, `/minus`, `/multiply`, `/divide`, `/count-characters`, `/todaydatetime`, `/factorial`, `/power`.
- Production build: `npm run build` (output in `dist/`). Preview with `npm run preview` if needed.

When using the dev server, set `VITE_API_BASE` empty or to the dev origin so proxied relative paths work; the default `http://localhost:3008` is used when calling the backend directly.

## Manual verification (see also CONTEXT.md#testing)

1. Run backend on port 3008 and `npm run dev` in this repo.
2. Open http://localhost:5173 — home should show health status, user list, and all home calculators after loads complete.
3. Click **Today Date Time** → `#/todaydatetime`; use **Get Date time** and confirm `datetime` appears.
4. Navigate to `#/count-characters`, submit text, confirm `count` or validation `error`.
5. Navigate to `#/power`, submit `a` and `b`, confirm `result` or `error`.
6. Return to `#/` (home) and exercise each calculator form against the backend.

## Environment

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE` | Base URL for `fetch` (default `http://localhost:3008`) |
