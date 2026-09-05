# Portfolio Project Architecture Review

## Project Overview

The project is a frontend-only application:
- **Frontend**: A React Single Page Application (SPA) built with Vite, TypeScript, and modern CSS/animations.
- **Backend**: None. All server code (`api/`, `server/`), contact-message sending (`/api/contact`), visitor tracking (`/api/visit`), health checks (`/api/health`), and email credentials (`.env` / `EMAIL_HOST_*`) were removed. The contact section is now static direct links (orbit socials + Telegram/GitHub/Discord) with no forms, no messages, and no tracking.

## Deployment: Vercel (Hobby Tier)

Static hosting only — no serverless functions, no environment variables required.

A `vercel.json` file is kept at the project root to ensure:
1. **Build Commands**: Explicitly sets `npm run build` and output directory `dist` for Vite.
2. **SPA Fallback Routing**: Unrecognized frontend routes automatically rewrite to `/index.html`.

### Manual Steps Required for Deployment

- [ ] **Import Repository**: Log in to the [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New... > Project". Select your GitHub repository (`Sabermrddz/Portfolio`).
- [ ] **Configure Build Settings**: Vercel should automatically detect Vite. Confirm the Build Command is `npm run build` and the Output Directory is `dist`.
- [ ] **Deploy**: Click "Deploy" and wait for the build to complete.

### Local Development

- `npm run dev` — Vite frontend only.
- `npm run build` / `npm run preview` — production build and preview.
