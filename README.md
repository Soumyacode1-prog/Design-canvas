# MiniCanvas

MiniCanvas is a full-stack design editor. Create rectangles, circles, and text, drag and edit them on a React Konva canvas, save designs to MongoDB, reopen or delete them, and export a PNG. Accounts use password hashing and HttpOnly access/refresh cookies with refresh-token rotation.

## Repository layout

```text
frontend/                 Next.js App Router UI and React Konva editor
  app/page.tsx            canvas editor and CRUD interactions
  app/auth-form.tsx       signup/login UI
  app/lib/api.ts          cookie-aware API client and refresh handling
backend/                  Express API and MongoDB models
  src/auth/               auth models, routes, cookie security, middleware
  src/controllers/        canvas CRUD handlers
  src/models/             Mongoose schemas
  src/routes/             API route registration
  src/schemas/            Zod request validation
```

## Setup

Requirements: Node.js 20+, MongoDB Atlas or MongoDB 6+.

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
cd backend && npm install && npm run dev
# in another terminal
cd frontend && npm install && npm run dev
```

Set `MONGODB_URI` to your connection string. The backend explicitly uses the `canvas` database, so users, sessions, and designs are stored in `canvas` regardless of whether the URI includes a database name. Set `CLIENT_URL` to the exact frontend origin. Keep `NEXT_PUBLIC_API_URL` pointed at the API.

Open http://localhost:3000, create an account, then log in. The browser sends HttpOnly cookies automatically; tokens are never stored in localStorage. Use HTTPS and `NODE_ENV=production` in deployment.


Deployed URL now serves both frontend and backend properly:
 
    https://frontend-nu-flax-71.vercel.app
    
** LOGIN CREDENTIALS: **

EMAIL : shambhavisoumya4@gmail.com
PASSWORD : HELLOWORLD123

## API endpoints

Authentication: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/refresh`, and `POST /api/auth/logout`.

Canvas CRUD: authenticated `POST /api/canvases`, `GET /api/canvases`, `GET /api/canvases/:id`, `PUT /api/canvases/:id`, and `DELETE /api/canvases/:id`. Canvas documents contain `owner`, `title`, `width`, `height`, `elements`, and timestamps. Every query is scoped to the signed-in owner.

## MongoDB collections

The `canvas` database contains `users`, `sessions`, and `canvases`. Passwords and token values are hashed; only token hashes and expiry metadata are stored server-side. The backend also uses `authattempts` for rate limiting.

## Validation

The implementation is organized as a sequence of concerns: the editor manages a local scene, the API validates and persists that scene, authentication establishes the account session, and owner filters isolate each user's canvases.

```bash
cd backend && npm test
cd frontend && npm run lint && npm run build -- --webpack
```

The backend integration test uses a randomly named temporary database and removes only that database. It covers auth validation, cookie flags, owner isolation, expiry, rotation, replay detection, logout, origin checks, and rate limiting.

## Known limitations and bonus features

There is no email verification, password reset, MFA, collaborative editing, image uploads, undo/redo, or server-side PNG storage. PNG export is client-side and downloads the current stage at 2x pixel ratio. Existing ownerless canvas records from older versions need an explicit owner migration before they can appear in an account. Optional bonus work already included: authentication, per-user ownership, refresh rotation and replay revocation, rate limiting, HttpOnly cookies, PNG export, and automated integration coverage.
