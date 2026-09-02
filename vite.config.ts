import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeHtml(str: string) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function apiPlugin() {
  return {
    name: "api-contact",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";
        if (!url.startsWith("/api/")) return next();

        // health
        if (url.startsWith("/api/health") && req.method === "GET") {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "ok",
              emailConfigured: !!(process.env.EMAIL_HOST_USER && process.env.EMAIL_HOST_PASSWORD && !process.env.EMAIL_HOST_USER.includes("your-actual")),
            })
          );
          return;
        }

        if (url.startsWith("/api/visit") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", async () => {
            try {
              const data = JSON.parse(body || "{}");
              const user = process.env.EMAIL_HOST_USER;
              const pass = process.env.EMAIL_HOST_PASSWORD;

              if (!user || !pass || user.includes("your-actual") || pass.includes("your-16")) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Email not configured. Set real EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env." }));
                return;
              }

              const nodemailer = await import("nodemailer");
              const { detectVisitorDevice } = await import("./server/visitor.js");
              const userAgent = data.userAgent || req.headers["user-agent"] || "Unknown";
              const page = data.page || req.headers.referer || "Unknown";
              const ipAddress = data.ipAddress || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "Unknown";
              const language = data.language || req.headers["accept-language"] || "Unknown";
              const timezone = data.timezone || "Africa/Algiers";
              const { device, browser, os } = detectVisitorDevice(String(userAgent));

              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user, pass },
              });

              const info = await transporter.sendMail({
                from: `"Portfolio Visitor" <${user}>`,
                to: user,
                subject: "🌐 New Website Visitor",
                text: [
                  "🌐 New Website Visitor",
                  "",
                  `IP Address: ${ipAddress}`,
                  `Device: ${device}`,
                  `Browser: ${browser}`,
                  `Operating System: ${os}`,
                  "Screen: Unknown",
                  `Language: ${language}`,
                  `Timezone: ${timezone}`,
                  `Page: ${page}`,
                  "",
                  "User-Agent:",
                  String(userAgent),
                ].join("\n"),
                html: `
                  <div style="font-family:Inter,Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;background:#0a0a0a;color:#ece9e2;border-radius:18px;border:1px solid #242424">
                    <h2 style="margin:0 0 12px;font-size:22px;color:#d4ff3f">🌐 New Website Visitor</h2>
                    <p style="margin:0 0 18px;color:#8a8880;font-size:13px">A visitor entered your website and the details below were captured.</p>
                    <table style="width:100%;border-collapse:collapse;margin-bottom:18px">
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">IP ADDRESS</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${String(ipAddress)}</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">DEVICE</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${device}</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">BROWSER</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${browser}</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">OPERATING SYSTEM</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${os}</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">SCREEN</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">Unknown</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">LANGUAGE</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${String(language)}</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">TIMEZONE</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${timezone}</td></tr>
                      <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">PAGE</td><td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${String(page)}</td></tr>
                    </table>
                    <div style="margin-top:18px;padding:16px;background:#121212;border:1px solid #242424;border-radius:12px">
                      <p style="margin:0 0 8px;color:#8a8880;font-size:11px;letter-spacing:0.15em">USER-AGENT</p>
                      <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:#ece9e2;font-size:12px;word-break:break-word">${String(userAgent)}</p>
                    </div>
                  </div>
                `,
              });

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, messageId: info.messageId }));
            } catch (err) {
              const msg = err instanceof Error ? err.message : String(err);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: `Visitor email failed: ${msg}` }));
            }
          });
          return;
        }

        // contact
        if (url.startsWith("/api/contact") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          req.on("end", async () => {
            try {
              const { name, email, message } = JSON.parse(body || "{}");
              if (!name || !email || !message) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Missing fields: name, email, message are required." }));
                return;
              }
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(email)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Invalid email format." }));
                return;
              }
              const user = process.env.EMAIL_HOST_USER;
              const pass = process.env.EMAIL_HOST_PASSWORD;
              if (!user || !pass || user.includes("your-actual") || pass.includes("your-16")) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error:
                      "Email not configured. Set real EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env (Gmail + 16-digit App Password). See .env.example",
                  })
                );
                return;
              }
              const nodemailer = await import("nodemailer");
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user, pass },
              });
              const mailOptions = {
                from: `"Portfolio Contact" <${user}>`,
                to: user,
                replyTo: `"${name}" <${email}>`,
                subject: `New portfolio message from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
                html: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#ece9e2;border-radius:16px"><h2 style="color:#d4ff3f">New portfolio message</h2><table style="width:100%"><tr><td style="color:#8a8880">NAME</td><td>${escapeHtml(name)}</td></tr><tr><td style="color:#8a8880">EMAIL</td><td><a href="mailto:${escapeHtml(email)}" style="color:#d4ff3f">${escapeHtml(email)}</a></td></tr></table><div style="margin:16px 0;padding:16px;background:#121212;border:1px solid #242424;border-radius:12px"><p style="color:#8a8880">MESSAGE</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div></div>`,
              };
              const info = await transporter.sendMail(mailOptions);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true, messageId: info.messageId }));
            } catch (err: unknown) {
              console.error("Vite API /api/contact error:", err);
              const msg = err instanceof Error ? err.message : String(err);
              const isAuth = /Invalid login|Username and Password not accepted|Authentication|EAUTH/i.test(msg);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: isAuth
                    ? "Gmail auth failed. Check EMAIL_HOST_USER and 16-digit App Password (needs 2FA + https://myaccount.google.com/apppasswords)."
                    : `Failed to send: ${msg}`,
                })
              );
            }
          });
          return;
        }
        return next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('gsap') || id.includes('framer-motion') || id.includes('lenis')) {
              return 'vendor-anim';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
