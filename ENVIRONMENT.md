# Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

---

## Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default `5000`) |
| `NODE_ENV` | `development` locally, `production` when deployed |
| `MONGO_URI` | MongoDB connection string from Atlas |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com |
| `JWT_SECRET` | Random secret for signing auth tokens |
| `REDIS_URL` | Redis Cloud connection string |

## Generate JWT_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Where to get each one

- **MONGO_URI** → [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → Connect → Drivers
- **ANTHROPIC_API_KEY** → [Anthropic Console](https://console.anthropic.com) → API Keys
- **REDIS_URL** → [Redis Cloud](https://cloud.redis.io) → your database → Configuration
- **JWT_SECRET** → generate with the command above

## Notes

- Never commit `.env` — only `.env.example` goes to version control
- Set `NODE_ENV=production` on your hosting platform to enable secure cookies