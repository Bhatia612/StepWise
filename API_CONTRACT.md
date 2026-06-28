# StepWise API Contract

Base URL: `http://localhost:5000/api/v1`

---

## Rate Limits

| Endpoint | Limit |
|---|---|
| `POST /explain` | 5 requests per minute per IP |
| All other endpoints | 100 requests per minute per IP |

Exceeding a limit returns `429 Too Many Requests`:
```json
{ "success": false, "message": "Too many requests. Please wait a moment before trying again." }
```

---

## Authentication

StepWise supports two modes:

- **Guest** — no account needed. A temporary session is tracked via an httpOnly cookie (`guestSessionId`), and explanations are stored in Redis for 24 hours.
- **Registered user** — sign up with username, email, and password. A JWT is issued in an httpOnly cookie (`token`), and explanations are stored permanently in MongoDB, scoped to that user.

Auth state is detected automatically per request — no special header needed. The same endpoints behave differently depending on whether a valid `token` cookie is present.

---

## Auth Endpoints

### Sign Up

**POST** `/api/v1/auth/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "at least 6 characters"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "64abc...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

Sets an httpOnly `token` cookie (7 day expiry).

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | Missing fields, password too short, or username/email already in use |
| `500` | Server error |

---

### Log In

**POST** `/api/v1/auth/login`

**Request Body:**
```json
{
  "identifier": "johndoe or john@example.com",
  "password": "at least 6 characters"
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "id": "64abc...",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

Sets an httpOnly `token` cookie (7 day expiry).

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | Missing identifier or password |
| `401` | Invalid credentials |
| `500` | Server error |

---

### Get Current User

**GET** `/api/v1/auth/me`

Requires a valid `token` cookie.

**Success Response — 200:**
```json
{
  "success": true,
  "data": { "id": "64abc...", "username": "johndoe", "email": "john@example.com" }
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `401` | Not authenticated or invalid/expired token |

---

### Log Out

**POST** `/api/v1/auth/logout`

**Success Response — 200:**
```json
{ "success": true, "message": "Logged out successfully" }
```

Clears the `token` cookie.

---

## Explainer Endpoints

### 1. Explain a DSA Problem

Sends a problem to Claude and returns a structured, step-by-step explanation. Saved to MongoDB if logged in, or Redis (24h expiry) if a guest.

**POST** `/api/v1/explain`

**Request Body:**
```json
{
  "problem": "Given an array of integers, return indices of the two numbers that add up to a target."
}
```

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64abc... or guest-<timestamp>",
    "problem": "Given an array of integers...",
    "pattern": "Hash Map (Complement Lookup)",
    "difficulty": "easy",
    "sections": [
      { "title": "Core Insight", "content": "..." },
      { "title": "Why a Hash Map", "content": "..." }
    ],
    "trace": [
      { "step": "i = 0", "detail": "value 2, complement 7 — map is empty. Store {2: 0}." }
    ],
    "traceNote": "Found in a single pass — no backtracking.",
    "pitfalls": [
      "Reusing the same element.",
      "Storing values instead of indices."
    ],
    "complexity": {
      "time": "O(n)",
      "timeReason": "Each lookup and insertion is O(1) on average.",
      "space": "O(n)",
      "spaceReason": "The map can grow up to n entries in the worst case."
    },
    "createdAt": "2026-06-21T09:42:11.000Z"
  }
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | Missing or empty problem in request body |
| `429` | Rate limit exceeded |
| `500` | Claude API failed or server error |

---

### 2. Get All Past Explanations

Returns explanation history — from MongoDB if logged in, from Redis if a guest. Newest first.

**GET** `/api/v1/explanations`

**Success Response — 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64abc... or guest-<timestamp>",
      "problem": "Two Sum",
      "pattern": "Hash Map (Complement Lookup)",
      "difficulty": "easy",
      "sections": [],
      "trace": [],
      "traceNote": "",
      "pitfalls": [],
      "complexity": { "time": "O(n)", "timeReason": "...", "space": "O(n)", "spaceReason": "..." },
      "createdAt": "2026-06-21T09:42:11.000Z"
    }
  ]
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `429` | Rate limit exceeded |
| `500` | Database fetch failed |

---

### 3. Get Single Explanation by ID

Returns one explanation by its MongoDB ID. **MongoDB only** — guest entries (Redis) are not fetchable by this endpoint, since the frontend already has the full object client-side when displaying a guest history item.

**GET** `/api/v1/explanations/:id`

**Success Response — 200:**
```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "problem": "Two Sum",
    "pattern": "Hash Map (Complement Lookup)",
    "difficulty": "easy",
    "sections": [],
    "trace": [],
    "traceNote": "",
    "pitfalls": [],
    "complexity": { "time": "O(n)", "timeReason": "...", "space": "O(n)", "spaceReason": "..." },
    "createdAt": "2026-06-21T09:42:11.000Z"
  }
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `404` | No explanation found with that ID |
| `429` | Rate limit exceeded |
| `500` | Database fetch failed |

---

## Response Format Rule

Every response follows the same shape:

**Success:**
```json
{ "success": true, "data": {} }
```

**Error:**
```json
{ "success": false, "message": "description of what went wrong" }
```