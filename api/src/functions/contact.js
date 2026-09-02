import { app } from '@azure/functions';
import nodemailer from 'nodemailer';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

app.http('contact', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let body;
        try {
            body = await request.json();
        } catch (e) {
            return { status: 400, jsonBody: { error: "Invalid JSON body" } };
        }

        const { name, email, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return { status: 400, jsonBody: { error: "Missing fields: name, email, message are required." } };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { status: 400, jsonBody: { error: "Invalid email format." } };
        }
        if (message.length > 5000) {
            return { status: 400, jsonBody: { error: "Message too long." } };
        }

        const user = process.env.EMAIL_HOST_USER;
        const pass = process.env.EMAIL_HOST_PASSWORD;

        if (!user || !pass || user.includes("your-actual") || pass.includes("your-16")) {
            context.error("Email credentials missing or placeholder in .env");
            return { status: 500, jsonBody: { error: "Email not configured. Set real EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env (Gmail + 16-digit App Password). See .env.example — current .env still has placeholder values." } };
        }

        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user,
                    pass,
                },
            });

            const mailOptions = {
                from: `"Portfolio Contact" <${user}>`,
                to: user, // you receive the message on your own email
                replyTo: `"${name}" <${email}>`,
                subject: `New portfolio message from ${name}`,
                text: `You received a new message via your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n—\nReply directly to ${email} to respond.`,
                html: `
                    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0a;color:#ece9e2;border-radius:16px">
                      <h2 style="margin:0 0 12px;font-size:20px;color:#d4ff3f">New portfolio message</h2>
                      <p style="margin:0 0 16px;color:#8a8880;font-size:13px">You received a new message via <strong>Send a message</strong> form.</p>
                      <table style="width:100%;border-collapse:collapse;margin:16px 0">
                        <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em">NAME</td><td style="padding:8px 0;color:#ece9e2;font-weight:600">${escapeHtml(name)}</td></tr>
                        <tr><td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em">EMAIL</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#d4ff3f;text-decoration:none">${escapeHtml(email)}</a></td></tr>
                      </table>
                      <div style="margin:16px 0;padding:16px;background:#121212;border:1px solid #242424;border-radius:12px">
                        <p style="margin:0 0 8px;color:#8a8880;font-size:11px;letter-spacing:0.15em">MESSAGE</p>
                        <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:#ece9e2">${escapeHtml(message)}</p>
                      </div>
                      <p style="margin:16px 0 0;font-size:12px;color:#8a8880">Reply directly to <a href="mailto:${escapeHtml(email)}" style="color:#d4ff3f">${escapeHtml(email)}</a> to respond.</p>
                      <p style="margin:12px 0 0;font-size:11px;color:#555">Sent from your portfolio contact form • ${new Date().toLocaleString()}</p>
                    </div>
                `,
            };

            const info = await transporter.sendMail(mailOptions);
            context.log(`Email sent: ${info.messageId} from ${name} <${email}>`);

            return { status: 200, jsonBody: { success: true, messageId: info.messageId } };
        } catch (err) {
            context.error("Failed to send email:", err);
            const msg = err instanceof Error ? err.message : String(err);
            const isAuth = /Invalid login|Username and Password not accepted|Authentication|EAUTH|535/i.test(msg);
            return {
                status: 500,
                jsonBody: {
                    error: isAuth
                        ? "Gmail auth failed — check EMAIL_HOST_USER is your Gmail and EMAIL_HOST_PASSWORD is a 16-digit App Password (https://myaccount.google.com/apppasswords, requires 2FA). Error: " + msg
                        : `Failed to send: ${msg}`,
                }
            };
        }
    }
});
