# PantryPal — Frontend

The React frontend for **PantryPal**, an app that turns recipes into a shopping list.
Submit a recipe by URL, name search, or file/screenshot upload, review the extracted
ingredients, and get a merged shopping list you can check off.

Backend repo: https://github.com/fmalyszczuk/ingredients-retriever

## Features

- Add a recipe from a URL, by typing its title and ingredients in by hand, or by
  uploading a PDF, DOCX, TXT, or a photo/screenshot
- View extracted ingredients per recipe
- Auto-merged shopping list across recipes, with quantity/unit aggregation
- Automatic unit conversion within the same family (weight: mg/g/kg/lb; volume:
  ml/l/pint/oz/tsp/tbsp/cup) — count-based units like `pcs` are left alone
- Mark items purchased, edit quantity/unit, or clear the whole list
- Chat-style interface for managing the shopping list in plain English, backed by the
  backend's local LLM (Ollama) tool-calling `/chat` endpoint

## Tech stack

- [React](https://react.dev/) via [Vite](https://vitejs.dev/) (not CRA)
- Native `fetch` for API calls, wrapped in [`src/api/client.js`](src/api/client.js) — no axios
- Plain CSS colocated per component — no UI kit
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react) for tests

## Getting started

### Prerequisites

- Node.js and npm
- The [backend](https://github.com/fmalyszczuk/ingredients-retriever) running locally
  (defaults to `localhost:8080`); requires Java 21, and [Ollama](https://ollama.com)
  running locally if you want the `/chat` feature to work

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

| Method   | Endpoint                       | Description                                        |
| -------- | ------------------------------- | --------------------------------------------------- |
| GET      | `/shopping-list`                | Get the merged shopping list                        |
| POST     | `/shopping-list/items`          | Add an item (sums into an existing one by name)     |
| PATCH    | `/shopping-list/items/{name}`   | Update quantity, unit, or purchased status           |
| DELETE   | `/shopping-list/items/{name}`   | Remove one item                                      |
| DELETE   | `/shopping-list`                | Clear the whole list                                 |
| GET      | `/recipes`                      | List saved recipes                                   |
| POST     | `/recipes`                      | Add a recipe by typing in its ingredients            |
| POST     | `/recipes/from-url`             | Add a recipe by scraping a recipe page               |
| POST     | `/recipes/from-text`            | Add a recipe from a dish name (LLM-suggested)        |
| POST     | `/chat`                         | Talk to the shopping list in plain English           |

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
