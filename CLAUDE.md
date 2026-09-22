# PantryPal — Frontend

## What this is
React frontend for PantryPal — lets a user submit a recipe (URL, name search,
or file/screenshot upload), see the extracted ingredients, and view a merged
shopping list. Talks to a Spring Boot backend (see ../pantrypal-backend/CLAUDE.md
or the shared root CLAUDE.md for backend details).

## Stack
- React (Vite, not CRA)
- Native `fetch` for API calls (no axios) — wrapped in `src/api/client.js`
- No state management library yet — useState/useContext is enough for this scope,
  don't reach for Redux/Zustand unless the app actually outgrows it
- Plain CSS, colocated per component (`Foo.jsx` + `Foo.css`) — no paid UI kits

## Backend contract (source of truth: backend OpenAPI/controllers, not this file)
- POST /recipes/from-url    { url }              → Recipe { ingredients[] }
- POST /recipes/from-text   { query }             → Recipe { ingredients[] }
- POST /recipes/from-file   multipart file         → Recipe { ingredients[] }
- GET  /shopping-list                              → ShoppingList { items[] }
Backend runs on localhost:8080 by default in dev — proxy config lives in
vite.config.js, don't hardcode the origin in components. The frontend calls
these under an `/api` prefix (e.g. `/api/recipes/from-url`); the dev proxy
strips `/api` before forwarding, so it never collides with frontend routes.
Override the target with `VITE_BACKEND_URL`.

## Conventions
- Functional components + hooks only, no class components
- One component per file, colocate a component's own CSS if not using Tailwind
- API calls live in a dedicated `api/` or `services/` folder, not inline in
  components — components call a function, not fetch() directly
- Loading and error states are not optional: every API-backed view needs both,
  since recipe extraction can be slow (LLM call) and can fail (bad URL, OCR miss)

## Testing
- Vitest + React Testing Library (jsdom), config in vite.config.js, setup in
  `src/test/setup.js`. Tests colocated as `Foo.test.jsx`. `npm test` (watch)
  or `npm run test:run` (once)
- Prioritize testing the ingredient-list rendering and the merge/aggregation
  display logic over trivial components

## No paid services
- No hosted UI component libraries requiring a license
- No analytics/tracking SDKs
- If you add any third-party API key here, it must be a free tier — note it in this file when you do