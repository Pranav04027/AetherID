# AetherID — Developer Integration Guide ("Log in with AetherID")

This document is for third-party developers building an app (e.g. **App A**) that wants to authenticate users via **AetherID**.

All endpoint behavior and payloads below are derived from the existing route handlers:

- `src/app/api/oauth/token/route.ts`
- `src/app/api/oauth/userinfo/route.ts`
- `src/app/api/oauth/logout/route.ts`

## Base URLs

- **Authorization UI (end-user login):** `GET /login`
- **OAuth API base:** `/api/oauth/*`

In production you will host these under your AetherID domain, e.g. `https://id.example.com`.

## High-level Flow

AetherID implements the **Authorization Code** flow with a login UI that issues a one-time `code`, followed by a token exchange.

1. Your app redirects the user to AetherID’s login UI (`GET /login`) with OAuth-like query params.
2. The login UI calls `POST /api/user/login`, which **creates an authorization code** and redirects the user back to your `redirect_uri` with `?code=<...>`.
3. Your backend exchanges the code at `POST /api/oauth/token` with `grant_type=authorization_code`.
4. Your backend calls `GET /api/oauth/userinfo` with the access token.
5. Optional: revoke refresh tokens via `POST /api/oauth/logout`.

## 1) Authorization (Code Issuance)

### Authorization UI URL

`GET /login`

AetherID does **not** currently expose a dedicated `/authorize` API route in `src/app/api`. Instead, it uses the `/login` UI and the internal login API (`POST /api/user/login`) to mint an authorization code.

### Query Parameters

These are read by `src/app/login/page.tsx`:

- `client_id` (required)
- `redirect_uri` (required)
- `response_type` (required)

Supported value:

- `response_type=code`

Notes:

- `state` is **not** handled in the current codebase.

### What happens after login

After the user submits credentials, the login page redirects the browser to:

`{redirect_uri}?code={authorization_code}`

The `code` value comes from the response of `POST /api/user/login`.

### Internal endpoint that creates the code

`POST /api/user/login`

This endpoint is what actually creates the authorization code record (stored hashed) in MongoDB.

**Request JSON body (exact keys used in code):**

```json
{
  "redirect_uri": "https://app-a.example.com/callback",
  "responseType": "code",
  "client_id": "<clientId>",
  "user_Email": "user@example.com",
  "user_password": "user-password"
}
```

**Success response (`201`):**

```json
{
  "code": "<raw_authorization_code>",
  "message": "Created succcessfully",
  "success": true
}
```

Important validation behavior:

- `redirect_uri` must match one of the client’s `allowedRedirectUris`.
- The user must exist, and `user.isVerified` must be `true`.
- The authorization code expires ~7 minutes after creation.

## 2) Token Exchange

### Endpoint

`POST /api/oauth/token`

**Content-Type:** `application/json`

### Client Authentication

The token endpoint expects client credentials in the JSON body:

- `clientId`
- `clientSecret`

If `clientId`/`clientSecret` are missing or invalid, the API returns:

- `401 { "error": "invalid_client" }`

### Grant Types

The route supports two `grant_type` values:

- `authorization_code`
- `refresh_token`

#### A) `grant_type=authorization_code`

**Request JSON body (exact keys used in code):**

```json
{
  "grant_type": "authorization_code",
  "code": "<raw_authorization_code>",
  "redirectUri": "https://app-a.example.com/callback",
  "clientId": "<clientId>",
  "clientSecret": "<clientSecret>"
}
```

Note: this implementation expects `redirectUri` (camelCase) in the JSON body. Some OAuth/OIDC client libraries default to `redirect_uri` (snake_case), so your server may need to map `redirect_uri` -> `redirectUri` before calling this endpoint.

Validation behavior:

- `code` and `redirectUri` are required.
- The `code` is hashed (`sha256`) and looked up in the `AuthCode` collection.
- The code must be unexpired and unused.
- The stored `redirectUri` must exactly match the incoming `redirectUri`.
- The code is marked `used=true` once exchanged.

**Success response (`200`):**

```json
{
  "access_token": "<jwt_access_token>",
  "token_type": "Bearer",
  "expires_in": 900,
  "refresh_token": "<jwt_refresh_token>"
}
```

Access token details (from code):

- JWT signed with `TOKEN_SECRET`
- Payload includes: `userId`, `email`, `clientId`
- Expiration: `15m`

Refresh token details (from code):

- JWT signed with `REFRESH_TOKEN_SECRET`
- Payload includes: `userId`
- Expiration: `7d`
- Stored in DB as `sha256(refresh_token)` with an `expiresAt`

#### B) `grant_type=refresh_token`

**Request JSON body (exact keys used in code):**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "<refresh_token>",
  "clientId": "<clientId>",
  "clientSecret": "<clientSecret>"
}
```

Refresh behavior:

- The incoming refresh token is verified with `REFRESH_TOKEN_SECRET`.
- The user is loaded by `decoded.userId`.
- The API checks that the token exists in the user’s `refreshToken[]` array (by `sha256(refresh_token)`), and that it hasn’t expired.
- **Rotation:** the incoming refresh token record is removed, then new tokens are issued.
- **Suspicious reuse handling:** if the refresh token verifies as a JWT but is not found in DB, the API clears `user.refreshToken = []` and returns `invalid_grant`.

**Success response:** same as the authorization_code response (returns a new `access_token` and a new `refresh_token`).

### Error Handling (Token Endpoint)

The token endpoint returns these OAuth-style error strings:

- `invalid_client` (HTTP `401`)
- `invalid_request` (HTTP `400`) — missing required fields
- `invalid_grant` (HTTP `400`) — bad/expired/used code, invalid refresh token, redirect mismatch, etc.
- `unsupported_grant_type` (HTTP `400`)
- `server_error` (HTTP `500`)

## 3) User Info

### Endpoint

`GET /api/oauth/userinfo`

### Required Headers

- `Authorization: Bearer <access_token>`

### Success Response (`200`)

AetherID returns the following JSON fields:

```json
{
  "sub": "<userId>",
  "email": "user@example.com",
  "name": "user_name",
  "preferred_username": "user_name",
  "email_verified": true
}
```

Notes:

- The handler checks that the user exists.
- The handler requires `user.isVerified === true`.

### Error Handling (Userinfo)

- Missing/invalid header:
  - HTTP `400`
  - `{"error":"invalid_request","error_description":"Missing Bearer Token"}`
- Invalid/expired token or user missing:
  - HTTP `401`
  - `{"error":"invalid_token", ...}`
- User not verified:
  - HTTP `403`
  - `{"error":"insufficient_scope","error_description":"User is not verified"}`

## 4) Logout / Revocation

### Endpoint

`POST /api/oauth/logout`

This endpoint behaves like a refresh-token revocation endpoint.

- It always returns `200 { "message": "Logged out successfully" }`.
- It deletes cookies named `accessToken` and `refreshToken` from the response (if present).
- It can remove refresh tokens stored on the user document.

### Headers

- `Authorization: Bearer <access_token>`

If the Authorization header is missing or invalid, the endpoint still returns a `200` success response.

### Request JSON body

```json
{
  "token": "<refresh_token_to_revoke>",
  "all": false
}
```

Revocation behavior:

- If `all === true`:
  - All refresh tokens are removed from the user in DB (`user.refreshToken = []`).
- Else if `token` is provided:
  - Only the matching refresh token is removed (by hashing the provided `token` and filtering `refreshToken[]`).

Notes:

- Access tokens are JWTs and are not persisted server-side; this route does not blacklist access tokens.

## Appendix: Client Registration (Getting `clientId` / `clientSecret`)

AetherID includes a client registration endpoint:

- `POST /api/client/register`

It generates a `clientId` and `clientSecret` and stores allowed redirect URIs.

**Request JSON body:**

```json
{
  "appName": "App A",
  "allowedRedirectUris": ["https://app-a.example.com/callback"],
  "userEmail": "developer@example.com"
}
```

The user must exist and be verified.
