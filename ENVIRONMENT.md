# Environment Variables

## Setup
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

## Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server runs on | `5000` |
| `MONGO_URI` | MongoDB connection string from Atlas | `mongodb+srv://...` |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com | `sk-ant-...` |

## Where to get them

- **MONGO_URI** → [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → Connect → Drivers
- **ANTHROPIC_API_KEY** → [Anthropic Console](https://console.anthropic.com) → API Keys