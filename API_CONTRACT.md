# StepWise API Contract

Base URL: `http://localhost:5000/api/v1`

---

## Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /explain` | 5 requests per minute per IP |
| Everything else | 100 requests per minute per IP |

Exceeding the limit returns `429` with `{ success: false, message: "..." }`.

---

## Auth

Two modes:
- **Guest** - no account needed. Session tracked via `guestSessionId` cookie, history stored in Redis for 24 hours. Limited to 3 free explains.
- **Registered** - JWT in `token` cookie (httpOnly). History stored permanently in MongoDB. Starts with 5 free credits, each explain costs 1.

> `/explain` currently allows guest access. Switch `auth` middleware to `protect` to restrict it to registered users only.

---

## Auth Endpoints

### POST `/auth/signup`

```json
// request
{ "username": "mohitk", "email": "mohit@dev.com", "password": "min 6 chars" }

// response
{ "success": true, "data": { "id": "...", "username": "mohitk", "email": "mohit@dev.com", "credits": 5 }, "migratedExplanations": 2 }
```

Sets `token` cookie (7 day expiry). Migrates guest history into the new account automatically.

Errors: `400` missing fields / already in use, `500` server error.

---

### POST `/auth/login`

```json
// request - username or email both work
{ "identifier": "mohitk or mohit@dev.com", "password": "..." }

// response
{ "success": true, "data": { "id": "...", "username": "mohitk", "email": "mohit@dev.com", "credits": 5 } }
```

Sets `token` cookie (7 day expiry).

Errors: `400` missing fields, `401` invalid credentials.

---

### POST `/auth/logout`

Clears the `token` cookie.

```json
{ "success": true, "message": "Logged out successfully" }
```

---

### GET `/auth/me`

Requires a valid `token` cookie.

```json
{ "success": true, "data": { "id": "...", "username": "mohitk", "email": "mohit@dev.com", "credits": 4 } }
```

Errors: `401` not authenticated.

---

## Explainer Endpoints

### POST `/explain`

Streams Claude's response via **Server-Sent Events**. Not a standard JSON response.

Registered users must have at least 1 credit. Returns `403` with `code: "NO_CREDITS"` if credits are 0.

```json
// request
{ "problem": "Given an array of integers, return indices of the two numbers that add up to a target." }
```

**SSE Events:**

```
event: meta
data: {"pattern": "Hash Map", "difficulty": "easy"}

event: section
data: {"title": "Core Insight", "content": "..."}

event: trace
data: {"steps": [...], "note": "..."}

event: pitfalls
data: {"items": ["...", "..."]}

event: complexity
data: {"time": "O(n)", "timeReason": "...", "space": "O(n)", "spaceReason": "..."}

event: done
data: {"data": { ...full saved explanation object... }, "creditsRemaining": 3}

event: error
data: {"message": "Something went wrong"}
```

Saved to MongoDB (registered users) or Redis (guests) once stream completes. Credit deducted after successful save.

Errors: `400` missing problem, `403` no credits, `429` rate limit, `500` server error.

---

### GET `/explanations`

Returns history - MongoDB for registered users, Redis for guests. Newest first.

```json
{ "success": true, "data": [...] }
```

---

### GET `/explanations/:id`

Returns one explanation by MongoDB ID. Registered users only.

```json
{ "success": true, "data": { ... } }
```

Errors: `404` not found, `500` server error.

---

## Payment Endpoints

### GET `/payments/packs`

Returns available credit packs. Public, no auth required.

```json
{
  "success": true,
  "data": [
    { "id": "starter", "name": "Starter Pack", "credits": 10, "price": 100, "description": "10 explanations" },
    { "id": "standard", "name": "Standard Pack", "credits": 30, "price": 250, "description": "30 explanations" },
    { "id": "pro", "name": "Pro Pack", "credits": 75, "price": 500, "description": "75 explanations" }
  ]
}
```

Note: `price` is in cents (100 = $1.00).

---

### POST `/payments/checkout`

Creates a Stripe checkout session. Requires a valid `token` cookie.

```json
// request
{ "packId": "starter" }

// response
{ "success": true, "data": { "url": "https://checkout.stripe.com/..." } }
```

Redirect the user to `url` to complete payment on Stripe's hosted page.

Errors: `400` invalid pack ID, `401` not authenticated, `500` server error.

---

### GET `/payments/credits`

Returns the current user's credit balance. Requires a valid `token` cookie.

```json
{ "success": true, "data": { "credits": 4 } }
```

Errors: `401` not authenticated.

---

### POST `/payments/webhook`

Stripe webhook endpoint. Called by Stripe after a payment completes. Not for direct use.

Verifies the Stripe signature, then increments the user's credits based on the purchased pack.

Returns `200` if handled successfully, `400` if signature verification fails.

---

## Response Format

Every non-SSE endpoint returns:

```json
// success
{ "success": true, "data": {} }

// error
{ "success": false, "message": "..." }
```