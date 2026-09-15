# API examples

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{"name":"A User","email":"a@example.com","password":"correct horse battery staple"}'
```

Browser requests must include credentials so the HttpOnly cookies are sent.
