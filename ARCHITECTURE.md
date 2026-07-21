# StepWise — Architecture

How the pieces fit together and why certain decisions were made.

---

## High-Level Flow

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   React      │─────▶│   Express    │─────▶│  Claude API  │
│   Frontend   │◀─────│   Backend    │◀─────│  (Anthropic) │
└─────────────┘      └──────┬───────┘      └──────────────┘
                             │
                 ┌───────────┴───────────┐
                 ▼                       ▼
          ┌─────────────┐         ┌─────────────┐
          │   MongoDB    │         │    Redis     │
          │ (registered  │         │  (guest      │
          │  users, data)│         │  sessions,   │
          │              │         │  rate limits)│
          └─────────────┘         └─────────────┘
```

The frontend never touches MongoDB, Redis, or Claude directly — everything goes through the Express API.

---

## Request Pipeline

```
Request
  → CORS / cookie parsing
  → Rate limiter
  → Auth check (optional)
  → Guest session (if no user)
  → Validation
  → Controller
  → Response
```

Rate limiter runs first so abusive requests get rejected before hitting auth or the database.

---

## Two Databases

Guest data and user data have different lifespans, so they live in different places.

| Data | Where | Why |
|---|---|---|
| Guest history | Redis, 24h TTL | Temporary — auto-deletes, no cleanup needed |
| User accounts + history | MongoDB | Permanent, queryable |
| Rate limit counters | Redis | Short-lived by nature |

Putting everything in MongoDB would mean either stale guest data piling up forever, or writing a cron job to clean it. Redis handles expiry natively.

---

## Guest Sessions

Guests get a UUID session ID stored in an httpOnly cookie. Their explanation history lives in Redis under that key and expires after 24 hours automatically.

The frontend also tracks how many times a guest has explained using `localStorage`. After the first explain, a soft nudge appears suggesting signup. After three explains, a hard block prevents further use until they sign up.

---

## Guest-to-User Migration

When a guest signs up, their Redis history moves into MongoDB under their new account — silently, as part of the signup flow.

```
Signup
  → Create user
  → Read Redis history for this session
  → insertMany() into MongoDB with userId
  → Delete Redis key + clear cookie
  → Issue JWT
```

---

## Auth

JWTs live in httpOnly cookies — not localStorage. JavaScript can't read httpOnly cookies, which protects against XSS attacks. The tradeoff is needing `withCredentials` on the frontend and `credentials: true` on CORS.

Auth state persists across page refreshes via `/auth/me`, called once on app load.

Two middleware variants:
- `protect` — hard block, 401 if no token. Used on `/auth/me`.
- `auth` (optional) — always proceeds, sets `req.user` if a token exists. Used on `/explain` and `/explanations`.

---

## Streaming

`/explain` uses Server-Sent Events instead of a standard HTTP response. The backend streams Claude's output to the frontend as it generates, so the user sees the explanation building up in real time rather than waiting 5-15 seconds for the full response.

The database save happens only once the full stream completes — streaming is a display decision, not a data one.

The frontend uses native `fetch` with a `ReadableStream` reader for this endpoint — axios doesn't support SSE streaming.

---

## Explanation Structure

The Claude prompt returns a flexible `sections` array rather than fixed fields. Claude decides what sections fit the specific problem. A graph problem and a two-pointer problem will have completely different section titles, but the same underlying shape — so the frontend renders them the same way regardless.

---

## Error Handling

All errors go through a single centralized middleware that returns `{ success: false, message: "..." }`. The `/explain` endpoint is an exception — since the SSE connection is already open, errors mid-stream are sent as an SSE `error` event instead of an HTTP status.

---

## Rate Limiting

5 requests/minute on `/explain`, 100/minute everywhere else. Counters live in Redis so they survive restarts and would work across multiple instances.
