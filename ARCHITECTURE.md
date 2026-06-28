# StepWise — Architecture

This document explains how StepWise's pieces fit together, and why specific design decisions were made.

---

## High-Level Flow
┌─────────────┐      ┌─────────────┐      ┌──────────────┐

│   React      │──────▶│   Express    │──────▶│  Claude API  │

│   Frontend   │◀──────│   Backend    │◀──────│  (Anthropic) │

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

The frontend never talks to MongoDB, Redis, or Claude directly — every request flows through the Express API, which decides what storage to use based on whether the request is authenticated.

---

## Request Lifecycle

Every request to a protected or data-touching route flows through the same pipeline:
Request

→ CORS / JSON parsing / cookie parsing  (global middleware)

→ Rate limiter                          (rejects early if abused)

→ auth (optional)                       (attaches req.user if a valid token cookie exists)

→ guestSession (conditional)             (attaches req.guestSessionId if no req.user)

→ validation                            (rejects malformed input before any real work happens)

→ controller                            (business logic)

→ response

This ordering is deliberate: cheapest checks first. A request that will be rejected by the rate limiter never even reaches auth logic. A request with a missing/invalid body never reaches the database or Claude.

---

## Why Two Databases

StepWise's core design decision: **not all data has the same lifespan, so it shouldn't all live in the same place.**

| Data type | Where it lives | Why |
|---|---|---|
| Guest explanation history | Redis, keyed by a random session ID, TTL of 24 hours | Temporary by nature — no account, no commitment, should clean itself up automatically |
| Registered user data (accounts, permanent explanations) | MongoDB | Needs to last indefinitely, support real queries (filtering by user, sorting) |
| Rate limit counters | Redis | Naturally short-lived (per-minute windows), and Redis is built for fast, expiring counters |

Using MongoDB for everything would mean either permanent storage filling up with abandoned guest data, or building a manual cleanup job. Redis solves this natively with TTL — no extra infrastructure needed.

---

## Guest Sessions

A guest is identified by a random UUID, stored in an httpOnly cookie (`guestSessionId`), generated the first time someone with no `token` cookie hits a relevant route.

Their explanation history is stored as a single Redis key per session:
guest:<sessionId> → JSON array of explanation objects

The whole array is read, modified, and rewritten on each new explanation — acceptable at this scale (a guest's session is short-lived and the array stays small), though a high-traffic version of this might shift to a different Redis data structure (like a List) to avoid rewriting the full value each time.

---

## Guest-to-User Migration

When a guest signs up, their Redis history doesn't just disappear — it's migrated into MongoDB under their new account.
Signup request received

→ User account created

→ Check for a guestSessionId cookie

→ if present: read their Redis history

→ insertMany() into MongoDB with the new userId attached

→ delete the Redis key

→ clear the guestSessionId cookie

→ Issue JWT, respond

This runs as a single helper function (`migrateGuestHistory`), called from the signup controller — kept separate from the controller itself so the migration logic can be tested or reused independently of the HTTP layer.

---

## Authentication

JWTs are issued on signup/login and stored in an **httpOnly cookie** — deliberately not `localStorage`. httpOnly cookies can't be read by JavaScript running in the browser, which protects the token from being stolen via a cross-site scripting (XSS) attack. The tradeoff is needing `withCredentials`/CORS `credentials: true` configured correctly on both ends, since the cookie must be explicitly allowed to travel across the frontend/backend origin boundary.

Two auth middlewares exist, for two different needs:

- **`protect`** — hard requirement. No valid token → request rejected with `401`. Used for routes that only make sense for a logged-in user (`/auth/me`).
- **`auth`** (optional auth) — soft check. Tries to identify the user if possible, but always calls `next()` regardless. Used for routes that behave differently depending on login state, but still work for guests (`/explain`, `/explanations`).

---

## Explanation Generation

Rather than returning a fixed set of fields for every problem, the Claude prompt asks for a **flexible `sections` array** — each with its own `title` and `content`, decided by Claude based on what that specific problem actually needs. A two-pointer problem and a graph traversal problem will return completely different section titles, but the same underlying shape, so the frontend never needs to know in advance what a problem "needs."

The same reasoning applies to the `trace` field — a step-by-step walkthrough that adapts its vocabulary to the problem (array indices, tree nodes, DP table cells, etc.) without the schema ever assuming a specific problem type.

---

## Error Handling

A single centralized error-handling middleware (`error.middleware.js`) catches every error forwarded via `next(error)`, ensuring every error response — regardless of where it originated — has the same shape:

```json
{ "success": false, "message": "..." }
```

Validation failures and auth rejections (`401`, `400`) are handled directly within their own middleware, since these are expected outcomes, not unexpected server errors — they don't need to flow through the centralized handler.

---

## Rate Limiting

`/explain` is rate-limited more strictly than other routes (5 requests/minute/IP vs 100/minute/IP for everything else), since each request triggers a real, billed call to the Claude API. Limits are tracked in Redis rather than in-memory, so they'd survive a server restart and work correctly even across multiple server instances, if StepWise were ever horizontally scaled.
