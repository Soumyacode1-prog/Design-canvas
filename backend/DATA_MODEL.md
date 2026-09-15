# Data model

`users` stores account identity and a password hash. `sessions` stores hashed access and refresh tokens with expiry and revocation state. `canvases` stores the owner, dimensions, title, and ordered editor elements. `authattempts` supports the login rate limit.
