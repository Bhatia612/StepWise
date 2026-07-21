# StepWise 🧠

A DSA thinking coach - paste a problem, get the thought process behind it, not the solution.

Built with React, Node.js, MongoDB, Redis, and the Claude API.

---

## The idea

Most platforms just give you the answer. StepWise explains how to think about the problem first - the pattern, the intuition, a step-by-step trace, common mistakes, and complexity reasoning.

---

## Features

- Explains DSA problems step by step without revealing code
- Streams responses in real time as Claude generates them
- Guest mode - try it without an account, up to 3 free explains
- Sign up to keep your history permanently - guest history migrates automatically
- History grouped by pattern with relative timestamps
- Rate limited to protect the API

---

## Tech

- **Frontend:** React (Vite), SCSS
- **Backend:** Node.js, Express
- **Databases:** MongoDB for users, Redis for guest sessions and rate limiting
- **Auth:** JWT in httpOnly cookies
- **AI:** Claude API with SSE streaming

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