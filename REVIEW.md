# Portfolio Project Architecture & Migration Review

## Project Overview

The project is a modern dual-mode application:
1. **Frontend**: A React Single Page Application (SPA) built with Vite, TypeScript, and modern CSS/animations.
2. **Backend**:
   - **New Architecture**: Vercel Serverless Functions located in the `api/` directory. This is the active backend structure intended for deployment on Vercel.
   - **Legacy Architecture**: An Express server located in the `server/` directory. This has been retained purely for reference and is no longer used in the active deployment pipeline.

By moving to Vercel Serverless Functions, the frontend and backend are hosted seamlessly in a single Vercel deployment, leveraging serverless architecture for zero-maintenance auto-scaling, high performance, and minimal hosting costs.

## New `api/` Folder Structure

The `api/` directory utilizes Vercel Serverless Functions (Node.js runtime). Each file represents an individual HTTP endpoint.

- **`api/contact.js`**: An HTTP-triggered serverless function replicating the contact form logic. It accepts `POST` requests, validates incoming form data, and uses `nodemailer` to dispatch emails. Mapped to `/api/contact`.
- **`api/visit.js`**: An HTTP-triggered serverless function replicating the visitor analytics logic. It accepts `POST` requests, extracts visitor metadata (IP, user-agent, language, page, timezone) from the request headers and body, and uses `nodemailer` to send a notification. Mapped to `/api/visit`.
- **`api/health.js`**: A simple endpoint serving a `GET` health check to confirm the API is responsive and email variables are set. Mapped to `/api/health`.
- **`api/_visitor-helper.js`**: A shared helper module containing the core email templating and device detection logic for visitor tracking. Files prefixed with `_` are ignored by Vercel's routing, keeping it purely as an imported helper module.

## Environment Variables

All environment variables have remained **completely unchanged**:
- `EMAIL_HOST_USER`: Your Gmail address.
- `EMAIL_HOST_PASSWORD`: Your 16-digit Google App Password.

The Vercel Serverless Functions read from these exact variables via `process.env`.

## `vercel.json` Summary

A `vercel.json` file has been added to the project root. This configuration ensures:
1. **Build Commands**: Explicitly sets `npm run build` and output directory `dist` for Vite.
2. **API Routing**: Ensures `/api/(.*)` requests correctly resolve to the Functions.
3. **SPA Fallback Routing**: Unrecognized frontend routes (e.g., if a user refreshes a page on a specific route) automatically rewrite to `/index.html`, which is crucial for React Router to function properly.

## Deployment Recommendation: Vercel (Hobby Tier)

**Vercel (Hobby Tier)** is the recommended hosting approach. It will automatically build and deploy both your React frontend and your serverless backend from your GitHub repository with virtually zero configuration.

### Manual Steps Required for Deployment

To complete the deployment, you will need to perform the following steps:

- [ ] **Import Repository**: Log in to the [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New... > Project". Select your GitHub repository (`Sabermrddz/Portfolio`).
- [ ] **Configure Build Settings**: Vercel should automatically detect Vite. Confirm the Build Command is `npm run build` and the Output Directory is `dist`.
- [ ] **Set Environment Variables**: In the deployment configuration step, add the following under "Environment Variables":
  - Name: `EMAIL_HOST_USER`, Value: (Your Gmail)
  - Name: `EMAIL_HOST_PASSWORD`, Value: (Your 16-digit App Password)
- [ ] **Deploy**: Click "Deploy" and wait for the build to complete. Vercel will automatically provision the URLs for your site and functions.

---
*Note: The old Express backend in `server/` remains fully intact for reference. You can test the setup locally by running Vercel's CLI command (`npx vercel dev`), which will serve both the Vite frontend and the serverless functions simultaneously.*
