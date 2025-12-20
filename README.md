# AetherID - OAuth 2.0 Identity Provider

AetherID is a custom OAuth 2.0 Identity Provider (IdP) built with Next.js (App Router) and TypeScript. It implements internal user management flows (signup, login, email verification, password reset) and supports the OAuth 2.0 Authorization Code flow for third-party clients.

## Features

- **User Authentication (internal):** Signup, login, email verification, forgot/reset password flows with bcrypt and token hashing.
- **OAuth 2.0 Provider:** Authorization Code flow, token rotation, short-lived JWT access tokens.

## Tech Stack

- Next.js (App Router)
- TypeScript
- MongoDB / Mongoose
- JWT
- Bcrypt

## Quickstart

Prerequisites:

- Node.js (recommended 18+)
- MongoDB connection (cloud or local)

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` in the project root:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aetherid
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aetherid
DOMAIN=http://localhost:3000
TOKEN_SECRET=<long_random_hex>
REFRESH_TOKEN_SECRET=<long_random_hex>
MAILTOKEN=<mailtrap_token>
```

Note: if you previously used `MONGO_URI`, update it to `MONGODB_URI` (this is what the current DB connector reads).

3. Run the dev server:

```bash
npm run dev
```

## Project Structure (high level)

- `src/app/api/user/` — internal authentication endpoints (signup/login + verification and password reset)
- `src/app/api/oauth/` — OAuth protocol endpoints (`token/`, `userinfo/`, `logout/`)
- `src/app/api/client/` — client registration endpoint(s)
- `src/models/` — Mongoose schemas (`User`, `Client`, `AuthCode`)
- `src/dbConfig/` — DB connection
- `src/helpers/` — utilities (e.g. email)

See the source tree for full details.

## API Summary

1) OAuth (for third-party clients)

- Authorization UI: `GET /login` (issues an authorization `code` via `POST /api/user/login`)
- Token endpoint: `POST /api/oauth/token`
  - grant_type=`authorization_code` — exchange code for tokens
  - grant_type=`refresh_token` — refresh access token (rotates refresh token)
- Userinfo: `GET /api/oauth/userinfo` — requires `Authorization: Bearer <access_token>`
- Revoke / Logout: `POST /api/oauth/logout` — revokes tokens and clears cookies

2) Internal user API

- `POST /api/user/signup` — register a new user
- `POST /api/user/login` — authenticate and issue an authorization code (used by the OAuth flow)
- `POST /api/user/forgotpassword` — request password reset email
- `POST /api/user/resetpassword` — reset password using token

## Security Notes

- Access tokens are short-lived JWTs (e.g., 15 minutes). Refresh tokens are stored hashed in DB and rotated on use.
- `POST /api/oauth/logout` deletes `accessToken` and `refreshToken` cookies (if present) and can revoke refresh tokens stored in the database.

## Testing & Clients

- Use Postman or a test client (NextAuth/Auth.js) to exercise OAuth flows.
- Register client apps by creating a `Client` document in the database with `clientId`, `clientSecret`, and `allowedRedirectUris`.

## Contributing

- Open an issue or create a PR. Keep changes focused and add tests for auth flows where possible.

## Next steps (suggested)

- Add automated DB seed for test clients
- Add more docs for the authorization UI (`/login`)
- Add E2E tests for token rotation and revoke flows

---

File: [README.md](README.md)

If you'd like, I can also create a short `docs/` folder with individual endpoint examples and Postman collection.