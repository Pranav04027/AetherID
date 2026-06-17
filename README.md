# AetherID - OAuth 2.0 Identity Provider

AetherID is a custom OAuth 2.0 Identity Provider (IdP) built with Next.js (App Router) and TypeScript. It implements robust internal user management flows (signup, login, email verification, password reset) and securely supports the OAuth 2.0 Authorization Code flow for third-party clients.

## Architecture & Flows

The system is built around a dual-mode authentication architecture, securely separating internal dashboard sessions from third-party API access.

### 1. Internal Authentication
Handles direct user interactions with the AetherID platform. Sessions are managed securely via `httpOnly` JWT cookies to prevent XSS.

![Internal Authentication Flow](public/AetherID%20Internal.png)

### 2. OAuth 2.0 Provider Flow
Implements the standard Authorization Code flow. Third-party applications receive short-lived JWT Access Tokens and long-lived Refresh Tokens. Refresh tokens are hashed in the database, rotated on use, and strictly bound to specific `clientId`s for surgical revocation.

![OAuth 2.0 Flow](public/AetherID%20oauth.png)

### 3. Password Reset Flow
Users can securely reset their passwords. AetherID generates a high-entropy cryptographically secure token, emails the raw link to the user via Resend, and stores only the SHA-256 hash in the database with a strict 1-hour expiration.

![Password Reset Flow](public/AetherID%20password.png)

## Features

- **Dual-Mode Auth:** Seamlessly handles both internal cookie-based sessions and OAuth code issuance from the same `/login` endpoint.
- **Advanced Security:** Bcrypt password hashing (salt rounds: 12), SHA-256 opaque token hashing, and strict redirect URI validation.
- **Token Rotation & Revocation:** Refresh tokens are dynamically rotated upon use and can be revoked globally or per-client.
- **Atomic Operations:** Email verification failures automatically roll back database creation to prevent "zombie" accounts.

## Tech Stack

- Next.js (App Router)
- TypeScript
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- Bcrypt & Crypto

## Quickstart

**Prerequisites:**
- Node.js (v18+)
- MongoDB database (local or Atlas)

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` in the project root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster/aetherid
DOMAIN=http://localhost:3000
TOKEN_SECRET=<long_random_hex>
REFRESH_TOKEN_SECRET=<long_random_hex>
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

- `src/app/api/user/` — Internal auth endpoints (signup, login, verify, password reset)
- `src/app/api/oauth/` — OAuth protocol endpoints (`token/`, `userinfo/`, `logout/`)
- `src/app/api/client/` — Client registration for third-party apps
- `src/models/` — Mongoose schemas (`User`, `Client`, `AuthCode`)
- `src/helpers/` — Utilities (e.g., transactional emails)

## API Reference

### OAuth 2.0 (Third-Party Clients)
- **Authorize:** `GET /login` (Issues auth `code` via POST)
- **Token Exchange:** `POST /api/oauth/token` (Supports `authorization_code` and `refresh_token` grants)
- **User Info:** `GET /api/oauth/userinfo` (Requires Bearer token)
- **Revoke:** `POST /api/oauth/logout` (Revokes refresh tokens per client)

### Internal API
- **Signup:** `POST /api/user/signup`
- **Login:** `POST /api/user/login` (Issues `httpOnly` cookie)
- **Forgot Password:** `POST /api/user/forgotpassword` (Triggers secure reset email)
- **Reset Password:** `POST /api/user/resetpassword` (Validates hashed token & updates password)

## Testing & Clients

- Use Postman or an OAuth client library (like Auth.js) to test the flows.
- To register a third-party application, insert a document into the `clients` MongoDB collection with a `clientId`, `clientSecret`, and `allowedRedirectUris`.

## Contributing

Pull requests are welcome. Please ensure any changes to the authentication flows are heavily tested and maintain the strict stateless/stateful token separation boundaries.