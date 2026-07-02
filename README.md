# StepWise 🧠

A full-stack web app that helps junior developers and students understand DSA problems step-by-step - without jumping straight to code.

StepWise acts as a **thinking coach**: given a LeetCode-style problem, it breaks down the pattern, intuition, a worked trace, common pitfalls, and time/space complexity in plain English - tailored to the specific problem, not a fixed template.

---

## Why StepWise?

Most developers struggle with DSA not because they can't code -
but because they don't know *how to think* about a problem.
StepWise fixes that by teaching the thought process, not just the answer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), SCSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) - permanent storage for registered users |
| Cache / Sessions | Redis - guest sessions (24h auto-expiry) and rate limiting |
| Auth | JWT in httpOnly cookies |
| AI | Claude API (claude-sonnet-4-6) |

---

## Key Features

- **Adaptive explanations** - pattern, difficulty, tailored sections, a worked trace, common pitfalls, and complexity with reasoning - Claude decides the structure based on the specific problem, not a fixed template
- **Guest mode** - use the app without an account; history is kept in Redis for 24 hours then auto-deleted
- **Accounts** - sign up to keep explanation history permanently in MongoDB
- **Guest-to-account migration** - signing up automatically moves your guest history into your new account, silently, at the moment of signup
- **Auth-protected explain** - only registered users can call the Claude API, protecting against abuse
- **Redis-backed rate limiting** - 5 requests per minute on the explain endpoint, 100 per minute elsewhere
- **Loading skeleton** - pulsing placeholder while Claude is generating a response
- **Empty state with examples** - clickable example problems on first load so there's no blank-page anxiety
- **Fully responsive** - works on mobile and desktop

---

## Folder Structure

### Backend (`backend/`)

```
src/
├── config/         # MongoDB and Redis connections
├── controllers/    # Business logic per route
├── middlewares/    # Auth (protect + optional), validation, rate limiting, error handling, guest session
├── models/         # Mongoose schemas (User, Explanation)
├── routes/         # URL → controller mappings
├── utils/          # migrateGuestHistory helper
└── server.js       # Entry point
```

### Frontend (`frontend/`)

```
src/
├── features/
│   └── explainer/
│       ├── pages/        # ExplainerPage
│       ├── components/   # ProblemInput, ExplanationCard, ExplanationSkeleton, HistoryList, HistoryToggle, EmptyState
│       ├── hooks/        # useExplain, useHistory
│       ├── services/     # explainerService
│       └── styles/
├── shared/
│   ├── components/       # Navbar, AuthModal
│   ├── context/          # AuthContext
│   ├── services/         # api.js, authService.js
│   ├── styles/           # _tokens.scss, _global.scss
│   └── utils/            # formatRelativeTime, groupByPattern
└── main.jsx
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Redis Cloud account (or local Redis)
- Anthropic API key

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values - see ENVIRONMENT.md
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## API Overview

Full API contract → see [`API_CONTRACT.md`](./API_CONTRACT.md)

## Architecture

System design overview → see [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## Environment Variables

Full guide → see [`ENVIRONMENT.md`](./ENVIRONMENT.md)

---

## Author

Built by Mohit as a portfolio project.