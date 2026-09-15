# Security notes

Access and refresh tokens are opaque random values. Only SHA-256 token hashes are persisted. Cookies are HttpOnly and SameSite=Lax; production cookies also require Secure. Mutating requests require the configured Origin and refresh-token reuse revokes the session.
