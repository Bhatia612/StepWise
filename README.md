# StepWise 🧠

A DSA thinking coach - paste a problem, get the thought process behind it, not the solution.

Built with React, Node.js, MongoDB, Redis, the Claude API, and Stripe.

---

## The idea

Most platforms just give you the answer. StepWise explains how to think about the problem first - the pattern, the intuition, a step-by-step trace, common mistakes, and complexity reasoning.

---

## Features

- Explains DSA problems step by step without revealing code
- Streams responses in real time as Claude generates them
- Guest mode - 3 free explains without an account, soft nudge after the first
- Sign up to keep your history permanently - guest history migrates automatically
- Registered users get 5 free credits on signup, each explain costs 1
- Buy more credits via Stripe when you run out
- History grouped by pattern with relative timestamps
- Rate limited to protect the Claude API

---

## Tech

- **Frontend:** React (Vite), SCSS
- **Backend:** Node.js, Express
- **Databases:** MongoDB for users, Redis for guest sessions and rate limiting
- **Auth:** JWT in httpOnly cookies
- **AI:** Claude API with SSE streaming
- **Payments:** Stripe

---

## Running locally

```bash
# backend
cd backend
npm install
cp .env.example .env
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

See `ENVIRONMENT.md` for required environment variables.

---

## Docs

- [`API_CONTRACT.md`](./API_CONTRACT.md) - endpoint reference
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - system design decisions
- [`ENVIRONMENT.md`](./ENVIRONMENT.md) - environment setup

---

Built by Mohit.