# Authentication

The application uses the `canvas` database explicitly, even if the URI omits a database name.
MongoDB has a `users` collection (not a field on each canvas), plus `sessions`
and `authattempts`. Passwords are salted and hashed using scrypt. Random 256-bit
opaque access and refresh tokens are stored only in HttpOnly cookies; MongoDB
stores SHA-256 token hashes. No authentication tokens are stored in localStorage.

- Access token: 15 minutes, cookie path `/api`.
- Refresh token: 7 days absolute lifetime, cookie path `/api/auth`.
- Every refresh atomically replaces both tokens. Reuse of a consumed refresh
  token revokes the session, including its access token.
- Logout revokes the session immediately and clears both cookies.
- Cookies use SameSite=Lax, and Secure in NODE_ENV=production.
- Mutating requests must send the exact configured CLIENT_URL as their Origin.
- Signup and login share a MongoDB-backed limit of 30 attempts/IP/15 minutes.

## Local development

Keep these values consistent:

```
# backend/.env
MONGODB_URI=<your existing MongoDB URI>
PORT=5000
CLIENT_URL=http://localhost:3000

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run `npm run dev` in backend and frontend in separate terminals. Register an
account, then log in. The frontend sends cookies with credentials:include and
refreshes once when a protected request returns 401. Web Locks serialize refresh
requests across tabs in supported browsers; a shared promise handles requests
within a tab. Without Web Locks, simultaneous refreshes in separate tabs can
trigger reuse detection and require login again.

For production, use HTTPS and NODE_ENV=production. Deploy frontend and API on the
same site (for example app.example.com and api.example.com) for SameSite=Lax.
Set CLIENT_URL to the exact frontend origin and rebuild the frontend after
changing NEXT_PUBLIC_API_URL. If behind a proxy, configure Express trust proxy
for your specific trusted proxy topology before relying on per-client IP limits.

## API

- POST /api/auth/signup: { name, email, password }; creates account, returns 201.
- POST /api/auth/login: { email, password }; sets cookies and returns public user.
- GET /api/auth/me: returns public user if authenticated.
- POST /api/auth/refresh: rotates cookies; replay or expiry returns 401.
- POST /api/auth/logout: revokes session and clears cookies.

Passwords must be 12–128 characters. Tokens/password hashes are never returned
in response JSON. All canvas routes require authentication and filter by owner.
Existing ownerless designs remain in the database but are hidden from accounts;
assign ownership deliberately after verifying which account should own them.

## Verification

`npm test` builds the backend and runs HTTP integration checks using the configured
MongoDB server. It creates a randomly named `minicanvas_auth_test_*` database,
then removes only that test database. The MongoDB user needs permission to create
and drop that isolated database. It never modifies the normal application database.

The tests cover signup validation, duplicates, wrong passwords, cookie attributes,
private canvas CRUD, access expiration, refresh rotation, replay revocation,
refresh expiration, logout, Origin rejection, and rate limiting.

Email verification, password reset, and multi-factor authentication are not part
of this implementation.
