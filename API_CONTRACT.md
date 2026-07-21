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
- **Guest** — no account needed. Session tracked via `guestSessionId` cookie, history stored in Redis for 24 hours.
- **Registered** — JWT in `token` cookie (httpOnly). History stored permanently in MongoDB.

> `/explain` currently allows guest access. Switch `auth` middleware to `protect` to restrict it to registered users only.

---

## Auth Endpoints

### POST `/auth/signup`

```json
// request
{ "username": "mohitk", "email": "mohit@dev.com", "password": "min 6 chars" }

// response
{ "success": true, "data": { "id": "...", "username": "mohitk", "email": "mohit@dev.com" }, "migratedExplanations": 2 }
```

Sets `token` cookie (7 day expiry). Migrates guest history into the new account automatically.

Errors: `400` missing fields / already in use, `500` server error.

---

### POST `/auth/login`

```json
// request — username or email both work
{ "identifier": "mohitk or mohit@dev.com", "password": "..." }

// response
{ "success": true, "data": { "id": "...", "username": "mohitk", "email": "mohit@dev.com" } }
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
{ "success": true, "data": { "id": "...", "username": "mohitk", "email": "mohit@dev.com" } }
```

Errors: `401` not authenticated.

---

## Explainer Endpoints

### POST `/explain`

Streams Claude's response via **Server-Sent Events**. Not a standard JSON response.

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
data: {"data": { ...full saved explanation object... }}

event: error
data: {"message": "Something went wrong"}
```

Saved to MongoDB (registered users) or Redis (guests) once stream completes.

Errors: `400` missing problem, `429` rate limit, `500` server error.

---

### GET `/explanations`

Returns history — MongoDB for registered users, Redis for guests. Newest first.

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

## Response Format

Every non-SSE endpoint returns:

```json
// success
{ "success": true, "data": {} }

// error
{ "success": false, "message": "..." }
```
