# testing-ai-agent-frontend

Minimal Vite + vanilla JS sandbox for the AI coding-agent POC (Phase 8). Pair with the Express backend at `/home/milestone/testing_AI_Agent` (`GET /hello`, `/health-check`, `/health`, etc.).

## Purpose

Browser UI that consumes the backend JSON API. Agents implement screens from a frozen planner contract (`frontend.uiStates` + shared field names from `backend.endpoints`).

## Folder Structure

```
testing_AI_Agent_Frontend/
├── index.html
├── package.json
├── vite.config.js
├── CONTEXT.md
└── src/
    ├── main.js
    ├── MinusCalculator.js
    └── MultiplyCalculator.js
```

## Conventions

- **Language**: vanilla JavaScript ES modules (no React/Vue unless the contract says otherwise).
- **Build**: Vite (`npm run dev` / `npm run build`).
- **API client**: `fetch` against `VITE_API_BASE` (default `http://localhost:3008`). Expect JSON bodies; do not invent field names — use the contract response schema.
- **Naming**: flat `src/` files; UI states map 1:1 to contract `frontend.uiStates`.
- **Forms**: submit via `event.preventDefault()`; validate inputs before sending.

## API Surface (client)

- Base URL from `import.meta.env.VITE_API_BASE`.
- Call the same paths as the backend contract (e.g. `GET /health` → `{ "status": "ok" }`).
- Render contract field names exactly (`status`, not `healthStatus`, unless the contract says otherwise).
- `POST /minus` with body `{ a: number, b: number }` → `{ result: number }` (difference `a - b`).
- `POST /multiply` with body `{ a: number, b: number }` → `{ result: number }` (product `a * b`).

## Key Modules

- `src/main.js` — mounts `#app` and wires up all UI states (homepage: `mountUserList`, `mountPlusCalculator`, `mountMinusCalculator`, `mountMultiplyCalculator`).
- `src/MinusCalculator.js` — subtraction calculator component. Renders two number inputs (A and B), a "Minus" button, and a result area. Validates inputs client-side, sends `POST /minus`, and displays the `result` field or an error message.
- `src/MultiplyCalculator.js` — multiplication calculator component. Renders two number inputs (A and B), a "Multiply" button, and a result area. Validates inputs client-side, sends `POST /multiply`, and displays the `result` field or an error message.

## Testing

No test runner yet. Manual: `npm run dev` and verify the UI against a running backend.

## Ticket
Title: Add minus endpoint and UI
Requirements:
Add POST /multiply on backend with validation and tests. Frontend: two number inputs and a button that calls /multiply and shows the result.

## Merged PR
https://github.com/oaymohsin/testing_AI_Agent_Frontend/pull/5