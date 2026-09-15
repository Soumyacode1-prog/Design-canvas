# Troubleshooting

If signup returns 409, the email already exists. If protected requests return 401, log in again. If the API cannot connect, check `MONGODB_URI`, the Atlas network allowlist, and that the backend is listening on port 5000.
