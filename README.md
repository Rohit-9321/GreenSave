# GreenSteps Advanced — PRO Edition (with Postgres + Prisma)

This edition adds:
- Google Login (ID token verification)
- OTP Login via email (or console for demo)
- Cloud Uploads: Cloudinary (or Local fallback) — **No AWS/S3 in this build**
- Group Leaderboards
- Prisma ORM + **Postgres**
- Docker Compose with Postgres + backend + frontend

## Quick Start (All-in-one via Docker)
```bash
cp .env.example .env
# (edit .env for secrets; at minimum set JWT_SECRET)

docker-compose up --build
# backend: http://localhost:5050
# frontend: http://localhost:5173
```

Then run migrations (in another terminal):
```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

## Dev (without Docker)
1) Start Postgres locally and set `DATABASE_URL` in `.env` (see below).
2) Backend:
```bash
cd backend
cp .env.example .env
npm i
npx prisma migrate dev
npm run dev
```
3) Frontend:
```bash
cd ../frontend
npm i
npm run dev
```

## Env (.env)
```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/greensteps?schema=public

# Auth
JWT_SECRET=dev-super-secret
GOOGLE_CLIENT_ID= # your Google OAuth web client ID

# OTP email (optional)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="GreenSteps <no-reply@greensteps.app>"

# Uploads
UPLOAD_STRATEGY=local   # local | cloudinary | s3
UPLOAD_DIR=uploads

# Cloudinary (if UPLOAD_STRATEGY=cloudinary)
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# S3 (if UPLOAD_STRATEGY=s3)
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

## One-Click Deploy Notes
- Backend: Render (Docker) with Postgres add-on.
- Frontend: Vercel; set `VITE_API_URL` to backend URL.
- Run `npx prisma migrate deploy` on backend start.

## New Endpoints (high level)
- `POST /auth/google` — body `{ idToken }`
- `POST /auth/otp/start` — body `{ email }` (sends OTP)
- `POST /auth/otp/verify` — body `{ email, code }` (returns JWT)
- `GET /analytics/group-leaderboard` — CO₂ totals per group
- Uploads use `/upload/image` with Cloudinary/S3/local based on env
