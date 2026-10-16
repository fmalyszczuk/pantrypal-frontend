# PantryPal — Frontend

The React frontend for **PantryPal**, an app that turns recipes into a shopping list.
Submit a recipe by URL, name search, or file/screenshot upload, review the extracted
ingredients, and get a merged shopping list you can check off.

Backend repo: https://github.com/fmalyszczuk/ingredients-retriever

## Features

- Accounts: register, log in/out, email verification, and forgot/reset password —
  every other feature below requires a logged-in user
- Add a recipe from a URL, by typing its title and ingredients in by hand, by
  uploading a PDF, DOCX, TXT, or a photo/screenshot, or by searching a dish name
  for an LLM-suggested ingredient list
- View extracted ingredients per recipe
- Browse your saved recipes and delete one, optionally subtracting its ingredients
  from the shopping list too
- Auto-merged shopping list across recipes, with quantity/unit aggregation
- Add a one-off item straight to the shopping list without going through a recipe
- Automatic unit conversion within the same family (weight: mg/g/kg/lb; volume:
  ml/l/pint/oz/tsp/tbsp/cup) — count-based units like `pcs` are left alone
- Mark items purchased, edit quantity/unit, or clear the whole list
- Chat-style interface for managing the shopping list in plain English, backed by the
  backend's local LLM (Ollama) tool-calling `/chat` endpoint. The conversation is
  remembered server-side across messages (via `conversationId`), so follow-ups like
  "make it 3 kg" work; clearing the chat also forgets it on the backend
- Chat replies show which tools actually ran and their outcome, flag when the shopping
  list changed, and offer quick Yes/No buttons when a destructive action (clearing the
  list, deleting a recipe) needs confirmation before it runs

## Tech stack

- [React](https://react.dev/) via [Vite](https://vitejs.dev/) (not CRA)
- Native `fetch` for API calls, wrapped in [`src/api/client.js`](src/api/client.js) — no axios
- Plain CSS colocated per component — no UI kit
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for tests

## Getting started

### Prerequisites

- Node.js and npm
- The [backend](https://github.com/fmalyszczuk/ingredients-retriever) running locally
  (defaults to `localhost:8080`); requires Java 21 and Docker (for its PostgreSQL
  database), and [Ollama](https://ollama.com) running locally if you want the `/chat`
  feature to work

### Install and run

```bash
npm install
npm run dev
```

The app runs on Vite's dev server and proxies API calls to the backend — see
[`vite.config.js`](vite.config.js). To point at a different backend, set `VITE_BACKEND_URL`.

### Other scripts

```bash
npm run build      # production build
npm run preview    # preview the production build locally
npm test           # run tests in watch mode
npm run test:run   # run tests once
```

## Project structure

```
src/
  api/          API calls (auth, recipes, shopping list, chat) — never fetch() directly in components
  components/   Reusable UI components, each with colocated CSS and tests
  pages/        Top-level route pages
  pages/auth/   Login/register/forgot-password and the two email-link pages
  hooks/        Shared custom hooks
  test/         Vitest setup
```

## Authentication

Every endpoint except the few listed as *open* below requires a logged-in user — an
anonymous call gets `401`. Login is a session cookie, not a token the frontend ever
sees or stores:

- On startup the app calls `GET /auth/csrf` (sets the `XSRF-TOKEN` cookie) and then
  `GET /auth/me` — `200` shows the app, `401` shows the login page.
- Every `POST`/`PATCH`/`DELETE` must echo the `XSRF-TOKEN` cookie's value back in an
  `X-XSRF-TOKEN` header or get `403`. [`client.js`](src/api/client.js) does this for
  every request automatically, including file uploads.
- A `401` from *any* call (session expired, logged out elsewhere) falls back to the
  login page from wherever it happens — `client.js` fires a `pantrypal:unauthorized`
  event that `App.jsx` listens for, so no page has to special-case this itself.
- `POST /auth/login` can also answer `403` (email not verified — the login form offers
  to resend the link) or `429` (too many attempts — shown with the `Retry-After` time).
- The password-reset and email-verification links the backend emails out
  (`/verify-email?token=...`, `/reset-password?token=...`) are real URLs opened
  directly in a browser, not in-app navigation. There's no router: `App.jsx` matches
  `window.location.pathname` against these two paths once at the top, before the
  normal tabbed app, and renders a standalone page instead. Each one reads the token
  from `window.location.search` and immediately strips it with `history.replaceState`
  so it doesn't linger in browser history.
- Account settings (changing the password, deleting the account) aren't built yet.

## Backend contract

The frontend calls the backend under an `/api` prefix; the dev proxy strips `/api` before
forwarding, so it never collides with frontend routes.

| Method   | Endpoint                       | Description                                        |
| -------- | ------------------------------- | --------------------------------------------------- |
| POST     | `/auth/register`                | Create an account — *open*                           |
| POST     | `/auth/login`                   | Log in, sets the session cookie — *open*             |
| GET      | `/auth/csrf`                    | Get the CSRF token cookie — *open*                   |
| GET      | `/auth/me`                      | Who is logged in (`401` if nobody)                   |
| POST     | `/auth/verify-email`            | Confirm an email address with the emailed token — *open* |
| POST     | `/auth/resend-verification`     | Email the verification link again — *open*           |
| POST     | `/auth/forgot-password`         | Email a password reset link — *open*                 |
| POST     | `/auth/reset-password`          | Set a new password with the emailed token — *open*   |
| POST     | `/auth/logout`                  | Log out                                               |
| GET      | `/shopping-list`                | Get the merged shopping list                        |
| POST     | `/shopping-list/items`          | Add an item (sums into an existing one by name)     |
| PATCH    | `/shopping-list/items/{name}`   | Update quantity, unit, or purchased status           |
| DELETE   | `/shopping-list/items/{name}`   | Remove one item                                      |
| DELETE   | `/shopping-list`                | Clear the whole list                                 |
| GET      | `/recipes`                      | List saved recipes                                   |
| GET      | `/recipes/{id}`                 | Get one recipe                                        |
| DELETE   | `/recipes/{id}`                 | Delete a recipe (`?removeFromShoppingList=true` also subtracts its ingredients) |
| POST     | `/recipes`                      | Add a recipe by typing in its ingredients            |
| POST     | `/recipes/from-url`             | Add a recipe by scraping a recipe page               |
| POST     | `/recipes/from-text`            | Add a recipe from a dish name (LLM-suggested)        |
| POST     | `/recipes/from-file`            | Add a recipe from an uploaded PDF, DOCX, TXT, or image |
| POST     | `/chat`                         | Talk to the shopping list in plain English (optional `conversationId` for memory) |
| DELETE   | `/chat/{conversationId}`        | Forget a conversation                                |

The backend's OpenAPI/controllers are the source of truth for the contract — see the
[backend repo](https://github.com/fmalyszczuk/ingredients-retriever).

## Conventions

- Functional components + hooks only
- One component per file, with colocated CSS
- API calls live in `src/api/`, not inline in components
- Every API-backed view handles both loading and error states
- Tests are colocated as `*.test.jsx`

## No paid services

No hosted UI component libraries, no analytics/tracking SDKs, and any third-party API key
used here must be free tier.
