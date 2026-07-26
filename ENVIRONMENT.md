# Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

---

## Backend Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default `5000`) |
| `NODE_ENV` | `development` locally, `production` when deployed |
| `MONGO_URI` | MongoDB connection string from Atlas |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com |
| `JWT_SECRET` | Random secret for signing auth tokens |
| `REDIS_URL` | Redis Cloud connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key from dashboard.stripe.com |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Stripe CLI or dashboard |
| `FRONTEND_URL` | Frontend origin for Stripe redirects |

## Frontend Variables

Set in Vercel project settings (or a local `.env` in the frontend folder):

| Variable | Description |
|---|---|
| `VITE_API_URL` | API base path. Set to `/api/v1` in production (proxied through `vercel.json` to the Render backend — this keeps the auth cookie first-party instead of third-party, which is required for it to survive on mobile browsers). Falls back to `http://localhost:5000/api/v1` for local dev if unset. |

## Generate JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Where to get each one

- **MONGO_URI** - [MongoDB Atlas](https://cloud.mongodb.com) -> your cluster -> Connect -> Drivers
- **ANTHROPIC_API_KEY** - [Anthropic Console](https://console.anthropic.com) -> API Keys
- **REDIS_URL** - [Redis Cloud](https://cloud.redis.io) -> your database -> Configuration
- **JWT_SECRET** - generate with the command above
- **STRIPE_SECRET_KEY** - [Stripe Dashboard](https://dashboard.stripe.com) -> Developers -> API Keys
- **STRIPE_WEBHOOK_SECRET** - run `stripe listen --forward-to localhost:5000/api/v1/payments/webhook` and copy the `whsec_...` value it prints
- **FRONTEND_URL** - `http://localhost:5173` locally, your deployed frontend URL in production

## Notes

- Never commit `.env` - only `.env.example` goes to version control
- Set `NODE_ENV=production` on your hosting platform to enable secure cookies
- Use test Stripe keys (`sk_test_...`) locally, live keys (`sk_live_...`) in production
- Run `stripe listen` every time you restart local development to get a fresh webhook secret