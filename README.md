# Frontend

VetCare frontend application built with **React + Vite + TypeScript**.
This project includes production-ready app flows (auth, booking, account management), API integration, mocks, tests, linting, and formatting setup.

## What is implemented

- Authentication (sign in/sign up) with role-aware routing
- Automatic token expiration handling:
  - token expiry timestamp persistence
  - expiration checks on app initialization and API requests
  - automatic logout + redirect to sign-in + notification (`Token is expired`)
- Appointment booking flows (including slot availability handling)
- My Account flows (general info, pets management, password change)
- Receptionist and client route separation
- Mock API mode with MSW for local development

## Installation

```bash
npm install
```

## Available Scripts

### Development server

```bash
npm run dev
```

Starts the local development server.

```bash
npm run dev:mock
```

Starts the app with the MSW mock server enabled.

---

### Build

```bash
npm run build
```

1. Runs the TypeScript type check
2. Builds the production bundle using Vite

---

### Testing

```bash
npm run test
```

Runs Vitest in watch mode.

```bash
npx vitest run
```

Runs the full test suite once (CI-style).

```bash
npm run test:coverage
```

Runs tests with coverage.

```bash
npm run test:coverage:full
```

Runs coverage including all files.

---

### Preview production build

```bash
npm run preview
```

Runs a local server to preview the production build.

---

### Linting

```bash
npm run lint
```

Runs ESLint without fixing issues.

```bash
npm run lint:fix
```

Automatically fixes linting issues where possible.

---

### Formatting

```bash
npm run format
```

Formats the codebase using Prettier.

```bash
npm run format:check
```

Checks formatting without making changes.

---

### Combined checks

```bash
npm run check
```

Runs:

- ESLint
- Prettier format check

```bash
npm run fix
```

Automatically fixes:

- linting issues
- formatting

---

### Git hooks

```bash
npm run prepare
```

Initializes Husky for pre-commit hooks.

---

## Current Tech Stack

### Core

- React 19
- TypeScript
- Vite

### Styling & UI

- Tailwind CSS 4
- PostCSS + Autoprefixer
- MUI (Material UI)
- Emotion (CSS-in-JS)
- MUI Icons
- React DatePicker
- SVGR (vite-plugin-svgr)

### State Management & Data

- Redux Toolkit
- React Redux
- RTK Query (via Redux Toolkit)

### Forms & Validation

- React Hook Form
- @hookform/resolvers

### Routing

- React Router DOM

### Code Quality & Formatting

- ESLint
  - eslint-plugin-react
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh
  - typescript-eslint

- Prettier
- eslint-config-prettier
- eslint-plugin-prettier

### Git Hooks & Automation

- Husky
- lint-staged

### Development & Tooling

- TypeScript 5.9
- @vitejs/plugin-react
- Node types
- Globals

### API Mocking

- Uses [MSW](https://mswjs.io/) to mock browser API calls in development.
- Service worker file is generated at `public/mockServiceWorker.js`.
- Vite mode env files control behavior:
  - `.env.development` -> real API mode (`VITE_ENABLE_MSW=false`)
  - `.env.mock` -> mock API mode (`VITE_ENABLE_MSW=true`)
- API base URL is read from `VITE_API_URL` (with fallback to `public/config.js`).
- `npm run dev` uses real API (`window.__APP_CONFIG__.API_URL`).
- `npm run dev:mock` enables MSW and does not allow unhandled API calls to fall through.

Main files:

- `src/mocks/mock-fetch.ts` - startup gate and worker initialization.
- `src/mocks/browser.ts` - worker setup.
- `src/mocks/handlers/index.ts` - combines all handler modules.
- `src/mocks/handlers/auth.ts` - auth endpoints.
- `src/mocks/handlers/appointments.ts` - appointment endpoints.
- `src/mocks/handlers/pets.ts` - pets endpoints.
- `src/mocks/handlers/profile.ts` - profile endpoints.
- `src/mocks/handlers/veterinarians.ts` - veterinarian endpoints.
- `src/mocks/handlers/utils/auth-guard.ts` - Bearer token guard for protected routes.
- `src/mocks/data/mock-db.ts` - composed mock DB facade.
- `src/mocks/data/entities/*` - per-entity in-memory data modules.

To expand mocks for a new API area:

1. Add a new entity file in `src/mocks/data/entities`.
2. Add a new handler module in `src/mocks/handlers` (for example `pets.ts`).
3. Expose it from `src/mocks/data/mock-db.ts`.
4. Export and combine handlers in `src/mocks/handlers/index.ts`.

---

## Status

Actively developed project with implemented business flows and test coverage.

---
