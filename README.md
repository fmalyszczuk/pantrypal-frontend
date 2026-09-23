# PantryPal — Frontend

The React frontend for **PantryPal**, an app that turns recipes into a shopping list.
Submit a recipe by URL, name search, or file/screenshot upload, review the extracted
ingredients, and get a merged shopping list you can check off.

Backend repo: https://github.com/fmalyszczuk/ingredients-retriever

## Features

- Add a recipe from a URL, a text/name search, or an uploaded file
- View extracted ingredients per recipe
- Auto-merged shopping list across recipes, with quantity/unit aggregation
- Edit, update units, and clear items on the shopping list
- Chat-style interface for interacting with the assistant

## Tech stack

- [React](https://react.dev/) via [Vite](https://vitejs.dev/) (not CRA)
- Native `fetch` for API calls, wrapped in [`src/api/client.js`](src/api/client.js) — no axios
- Plain CSS colocated per component — no UI kit
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for tests

## Getting started

### Prerequisites

- Node.js and npm
- The [backend](link here) running locally (defaults to `localhost:8080`)

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
  api/          API calls (recipes, shopping list, chat) — never fetch() directly in components
  components/   Reusable UI components, each with colocated CSS and tests
  pages/        Top-level route pages
  hooks/        Shared custom hooks
  test/         Vitest setup
```

## Backend contract

The frontend calls the backend under an `/api` prefix; the dev proxy strips `/api` before
forwarding, so it never collides with frontend routes.

| Method | Endpoint              | Description                         |
| ------ | ---------------------- | ------------------------------------ |
| POST   | `/recipes/from-url`    | Extract a recipe from a URL          |
| POST   | `/recipes/from-text`   | Extract a recipe from a name/search  |
| POST   | `/recipes/from-file`   | Extract a recipe from an uploaded file |
| GET    | `/shopping-list`       | Get the merged shopping list         |

The backend's OpenAPI/controllers are the source of truth for the contract — see the
[backend repo](link here).

## Conventions

- Functional components + hooks only
- One component per file, with colocated CSS
- API calls live in `src/api/`, not inline in components
- Every API-backed view handles both loading and error states
- Tests are colocated as `*.test.jsx`

## No paid services

No hosted UI component libraries, no analytics/tracking SDKs, and any third-party API key
used here must be free tier.
