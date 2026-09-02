# Portfolio Project Architecture & Migration Review

## Project Overview

The project is now a dual-mode application:
1. **Frontend**: A React Single Page Application (SPA) built with Vite, TypeScript, and modern CSS/animations.
2. **Backend**:
   - **New Architecture**: An Azure Functions API located in the `api/` directory. This is the active backend structure intended for deployment on Azure Static Web Apps (Free tier).
   - **Legacy Architecture**: An Express server located in the `server/` directory. This has been retained purely for reference and is no longer used in the active deployment pipeline.

By moving to Azure Functions and Azure Static Web Apps, the frontend and backend can be hosted together in a single service without the need for a persistently running Node.js server, significantly reducing hosting costs and simplifying deployment.

## New `api/` Folder Structure

The `api/` directory utilizes the Azure Functions v4 Node.js programming model.

- **`api/package.json` & `api/host.json`**: Standard Azure Functions v4 configuration files, including dependencies like `@azure/functions` and `nodemailer`.
- **`api/src/functions/contact.js`**: An HTTP-triggered Azure Function that replaces the legacy `POST /api/contact` Express route. It validates incoming contact form submissions and uses `nodemailer` to dispatch the email.
- **`api/src/functions/visit.js`**: An HTTP-triggered Azure Function that replaces the legacy `POST /api/visit` Express route. It parses visitor metadata (IP, user-agent, language, page, timezone) from the Azure request context and uses `nodemailer` to send an analytics email.
- **`api/src/functions/health.js`**: An HTTP-triggered Azure Function that replaces the legacy `GET /api/health` Express route, providing a simple status check and verifying if email credentials are set.
- **`api/src/visitor.js`**: A shared helper module (adapted from `server/visitor.js`) containing reusable logic for device detection, HTML email templating, and the core visitor email sending logic. Both `contact.js` and `visit.js` rely on this.

## Environment Variables

All environment variables have remained **completely unchanged** to ensure a seamless transition:
- `EMAIL_HOST_USER`: Your Gmail address.
- `EMAIL_HOST_PASSWORD`: Your 16-digit Google App Password.

The new Azure Functions read from these exact same variables via `process.env`.

## `staticwebapp.config.json` Summary

A `staticwebapp.config.json` file has been added to the project root. This configuration ensures:
1. **SPA Fallback Routing**: Unrecognized frontend routes (e.g., if a user refreshes a page on a specific route) automatically fall back to `/index.html`, which is required for React Router to function properly.
2. **API Passthrough**: Azure Static Web Apps automatically proxies any requests to `/api/*` directly to the Azure Functions backend (`api/` folder) without any additional configuration required in the frontend fetch calls.
3. **Caching**: Disables caching on dynamic routes to ensure fresh data.

## Deployment Recommendation: Azure Static Web Apps

**Azure Static Web Apps (Free Tier)** is the recommended hosting approach. It will automatically build and deploy both your React frontend and your Azure Functions backend from a single GitHub repository.

### Manual Steps Required in Azure Portal / CLI

To complete the deployment, you will need to perform the following steps:

- [ ] **Create the Resource**: In the Azure Portal, create a new "Static Web App".
- [ ] **Link GitHub Repository**: Connect it to your GitHub repository (`Sabermrddz/Portfolio`).
- [ ] **Configure Build Settings**:
  - Build Presets: React
  - App location: `/` (Root directory for the frontend)
  - Api location: `api` (Directory for the Azure Functions)
  - Output location: `dist` (Vite's default build folder)
- [ ] **Set Application Settings**: Once the resource is created, navigate to **Settings > Configuration** in the Azure Portal and add your environment variables:
  - Name: `EMAIL_HOST_USER`, Value: (Your Gmail)
  - Name: `EMAIL_HOST_PASSWORD`, Value: (Your 16-digit App Password)
- [ ] **Verify Deployment**: Azure will automatically trigger a GitHub Action to build and deploy your app. Check the Actions tab in your GitHub repo for the status.

---
*Note: The old Express backend in `server/` remains fully intact. If you ever need to run the legacy server locally, you can still use `npm run server`, though the frontend now expects to communicate with the Azure Functions when deployed to SWA.*
