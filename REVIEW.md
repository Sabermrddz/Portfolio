# Technical Review: Portfolio Project

## 1. Project Overview
This project is a **Full-Stack Web Application**. The frontend is built using **React and Vite**, heavily utilizing Tailwind CSS, GSAP, and Framer Motion for styling and animations. Unlike a purely static frontend, this project includes a dedicated **Node.js backend** to handle contact form submissions and track visitor analytics via email.

## 2. Server/ Backend Analysis
The backend is located entirely within the `server/` directory and is built using the **Express.js** framework.

### File Summaries
- **`index.js`**: The main entry point for the Express server. It handles environment variable loading, middleware configuration (CORS, JSON parsing), defines the API endpoints, and starts the server process. In production mode, it also serves the compiled static Vite frontend (`dist/` folder).
- **`visitor.js`**: A utility module that provides functions to parse the `user-agent` string to detect the visitor's device, browser, and OS. It also handles constructing the HTML email template for visitor notifications and sending it.
- **`visitor.d.ts` & `visitor.test.js`**: TypeScript definitions and test coverage for the visitor utility functions.

### API Endpoints
- **`GET /api/health`**: A simple health check route that returns the server status and indicates if the email credentials are fully configured.
- **`POST /api/contact`**: Receives data from the frontend contact form (`name`, `email`, `message`). It performs basic validation and utilizes Nodemailer to send the message directly to the site owner's email address.
- **`POST /api/visit`**: An analytics endpoint triggered when a user visits the site. It collects visitor metadata and sends a detailed notification email to the site owner.

### Visitor Metadata Collection
The server collects visitor data primarily by parsing standard HTTP headers in `visitor.js`:
- **IP Address**: `req.headers["x-forwarded-for"]` or `req.socket.remoteAddress`
- **Device, Browser, OS**: Parsed via regex matching against `req.headers["user-agent"]`
- **Page Visited**: `req.headers.referer`
- **Language**: `req.headers["accept-language"]`

### Email Sending Mechanism
Emails are sent via **SMTP** using the **Nodemailer** package (`nodemailer`). The server creates a transport explicitly configured to use the `"gmail"` service, expecting a Gmail address and an App Password.

### Environment Variables
The server relies on the `.env` file for configuration. Based on `.env.example` and the code, it expects:
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- `PORT` (Optional)
- `NODE_ENV` (Implicitly checked to serve static files in production)

## 3. Package.json Analysis

### Backend Dependencies
- **`express`**: Web framework for handling routes.
- **`cors`**: Middleware to enable Cross-Origin Resource Sharing.
- **`dotenv`**: Loads environment variables from the `.env` file.
- **`nodemailer`**: Module for sending emails.
- **`concurrently` (devDependency)**: Used to run multiple npm scripts simultaneously.

### Scripts
- **`dev`**: `vite` — Starts the frontend React development server.
- **`build`**: `vite build` — Compiles the React frontend for production into the `dist/` folder.
- **`start`** / **`server`**: `node server/index.js` — Starts the Node.js Express backend.
- **`dev:all`**: Runs `concurrently "vite" "node server/index.js"` — Starts both the Vite frontend and Express backend at the same time for local full-stack development.

### Server Execution Model
The server is currently designed as a **long-running process**. It uses `app.listen(PORT)` to bind to a port and continuously listen for incoming HTTP requests. 

## 4. Deployment Requirements

### Hosting Approach
Because it is a long-running Express server, you cannot deploy this to a purely static host (like GitHub Pages or standard Netlify). 
- **Current architecture**: Requires a persistent Node.js environment (e.g., Azure App Service, Heroku, Render, DigitalOcean App Platform).
- **Serverless adaptation**: The backend logic could easily be converted to serverless functions (like Azure Functions, AWS Lambda, or Next.js API routes) since it primarily consists of stateless POST endpoints that send emails. You would just need to extract the route handlers from `index.js` into standalone function files.

### Configuration & Security Tweaks for Production
- **CORS**: Currently set to `app.use(cors())`, which allows requests from *any* origin. In production, this should be restricted to your exact frontend domain (e.g., `cors({ origin: 'https://yourportfolio.com' })`).
- **Secrets**: The `EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` must be securely injected as environment variables in your hosting provider's dashboard, never committed to version control.

## 5. Summary Table

| Component | Role / Purpose | Entry File | Recommended Hosting Approach |
| :--- | :--- | :--- | :--- |
| **Frontend** | React SPA handling the UI, animations, and form logic. | `src/main.tsx` | Static Site Hosting (Azure Static Web Apps, Vercel) or served by backend. |
| **Backend** | Express API handling email delivery for contact forms and visitor analytics. | `server/index.js` | Persistent Node.js Server (Azure App Service, Render) OR refactor to Serverless APIs. |
