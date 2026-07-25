# StepWise - Architecture

How the pieces fit together and why certain decisions were made.

---

## High-Level Flow

```
+--------------+      +--------------+      +--------------+
|   React      |----->|   Express    |----->|  Claude API  |
|   Frontend   |<-----|   Backend    |<-----|  (Anthropic) |
+--------------+      +------+-------+      +--------------+
                             |
                 +-----------+-----------+
                 v                       v
          +-----------+           +-----------+
          |  MongoDB  |           |   Redis   |
          | (users,   |           | (guests,  |
          |  history) |           |  limits)  |
          +-----------+           +-----------+
                             |
                             v
                      +-----------+
                      |  Stripe   |
                      | (payments)|
                      +-----------+
```

The frontend never touches MongoDB, Redis, Claude, or Stripe directly. Everything goes through the Express API.

---

## Request Pipeline

```
Request
  -> CORS / cookie parsing
  -> Rate limiter
  -> Auth check (optional)
  -> Guest session (if no user)
  -> Credit check (blocks if no credits)
  -> Validation
  -> Controller
  -> Response
```

Rate limiter runs first so abusive requests get rejected before hitting auth or the database. Credit check runs after auth so it knows whether the requester is a guest or a registered user.

---

## Two Databases

Guest data and user data have different lifespans, so they live in different places.

| Data | Where | Why |
|---|---|---|
| Guest history | Redis, 24h TTL | Temporary, auto-deletes |
| User accounts and history | MongoDB | Permanent, queryable |
| Rate limit counters | Redis | Short-lived by nature |

Putting everything in MongoDB would mean stale guest data piling up forever or writing a cron job to clean it. Redis handles expiry natively.

---

## Guest Sessions

Guests get a UUID session ID stored in an httpOnly cookie. Their explanation history lives in Redis under that key and expires after 24 hours.

The frontend also tracks how many times a guest has explained using localStorage. After the first explain, a soft nudge appears suggesting signup. After three explains, a hard block prevents further use until they sign up. This is purely client-side - no backend changes needed.

---

## Guest-to-User Migration

When a guest signs up, their Redis history moves into MongoDB under their new account.

```
Signup
  -> Create user
  -> Read Redis history for this session
  -> insertMany() into MongoDB with userId
  -> Delete Redis key and clear cookie
  -> Issue JWT
```

---

## Credits System

Registered users get 5 free credits on signup. Each successful explain call costs 1 credit. Credits are stored on the User document and decremented atomically using MongoDB's `$inc` operator to prevent race conditions.

```
POST /explain
  -> checkCredits middleware - blocks if credits <= 0 (403, code: NO_CREDITS)
  -> Claude generates explanation
  -> Save to MongoDB
  -> User.findByIdAndUpdate({ $inc: { credits: -1 } })
  -> Send done event with creditsRemaining
```

When a user runs out of credits, the frontend shows a pricing modal. Buying a pack redirects to Stripe's hosted checkout. Credits are added via the webhook after payment is confirmed.

---

## Stripe Payments

Three credit packs available: Starter (10 credits, $1.00), Standard (30 credits, $2.50), and Pro (75 credits, $5.00).

```
User clicks Buy Now
  -> POST /payments/checkout - creates Stripe session with userId and credits in metadata
  -> Frontend redirects to Stripe hosted checkout
  -> User pays
  -> Stripe sends POST to /payments/webhook
  -> Backend verifies signature using STRIPE_WEBHOOK_SECRET
  -> User.findByIdAndUpdate({ $inc: { credits: parseInt(credits) } })
  -> Frontend detects /payment/success on load, fetches fresh credits, shows toast
```

The webhook endpoint must receive the raw request body before Express parses it. This is why the webhook route is registered before app.use(express.json()).

---

## Auth

JWTs live in httpOnly cookies - not localStorage. JavaScript cannot read httpOnly cookies, which protects against XSS attacks. The tradeoff is needing withCredentials on the frontend and credentials: true on CORS.

Auth state persists across page refreshes via /auth/me, called once on app load. The response includes the current credit balance so the navbar shows the correct count immediately.

Two middleware variants:
- protect - hard block, 401 if no token. Used on /auth/me and payment routes.
- auth (optional) - always proceeds, sets req.user if a token exists. Used on /explain and /explanations.

---

## Streaming

/explain uses Server-Sent Events instead of a standard HTTP response. The backend streams Claude's output as NDJSON lines - each line is a complete JSON object representing one piece of the explanation (meta, section, trace, pitfalls, complexity). The frontend parses each line as it arrives and builds the ExplanationCard progressively.

The database save happens only once the full stream completes. Credit deduction also happens after the save, so no credit is lost if Claude or the database fails.

The frontend uses native fetch with a ReadableStream reader - axios does not support SSE streaming.

---

## Error Handling

All errors go through a single centralized middleware that returns { success: false, message: "..." }. The /explain endpoint is an exception - since the SSE connection is already open, errors mid-stream are sent as an SSE error event instead of an HTTP status.

---

## Rate Limiting

5 requests per minute on /explain, 100 per minute everywhere else. Counters live in Redis so they survive restarts and would work across multiple instances.
