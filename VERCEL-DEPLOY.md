# Vercel Deployment

This repo deploys as one Vercel project:

- Vite frontend from `frontend/dist`
- Fastify API through `api/[...fastify].ts`
- Supabase Postgres through Prisma

## Vercel Settings

Import the repository into Vercel and keep the root directory as the repo root.

The repo includes `vercel.json`, so Vercel should use:

```txt
Install Command: npm install && npm install --prefix frontend
Build Command: npm run build --prefix frontend
Output Directory: frontend/dist
```

Routes:

- `/` and app routes serve the Vite SPA.
- `/api/*` routes go to the Fastify serverless function.

## Environment Variables

Set these in Vercel Project Settings -> Environment Variables.

Required:

```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:URL_ENCODED_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres.PROJECT_REF:URL_ENCODED_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
JWT_REFRESH_SECRET="generate-a-long-random-secret"
ENCRYPTION_KEY="64-hex-character-encryption-key"
ENCRYPTION_IV="32-hex-character-encryption-iv"
FRONTEND_URL="https://YOUR-VERCEL-DOMAIN.vercel.app"
```

Optional/currently feature-dependent:

```env
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-supabase-publishable-key"
REDIS_URL=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_S3_BUCKET=""
AWS_REGION="ap-south-1"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""
OPENAI_API_KEY=""
```

Do not set `VITE_API_URL` when deploying frontend and API together on the same Vercel project. The frontend uses same-origin `/api` by default.

Only set `VITE_API_URL` if the API is deployed separately.

## Database

Before deploying, make sure Supabase is in sync:

```bash
npx prisma db push --skip-generate
npx prisma generate
```

## Local Verification

Run these before pushing:

```bash
npx tsc --noEmit
npm run build --prefix frontend
npm test
```

## Notes

- Direct dashboard URLs are client-guarded and API-guarded. The page may load the SPA shell, but dashboard data requires a valid token.
- Serverless cold starts can make first API requests slower.
- Large frontend chunks currently produce a Vite warning; this does not block deployment.
