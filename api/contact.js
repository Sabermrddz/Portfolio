import nodemailer from 'nodemailer';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields: name, email, message are required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ error: "Message too long." });
  }

  const user = process.env.EMAIL_HOST_USER;
  const pass = process.env.EMAIL_HOST_PASSWORD;

  if (!user || !pass || user.includes("your-actual") || pass.includes("your-16")) {
    console.error("Email credentials missing or placeholder in .env");
    return res.status(500).json({ error: "Email not configured. Set real EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${user}>`,
      to: user,
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
    console.log(`Email sent: ${info.messageId} from ${name} <${email}>`);

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error("Failed to send email:", err);
    const msg = err instanceof Error ? err.message : String(err);
    const isAuth = /Invalid login|Username and Password not accepted|Authentication|EAUTH|535/i.test(msg);
    res.status(500).json({
      error: isAuth
        ? "Gmail auth failed — check EMAIL_HOST_USER is your Gmail and EMAIL_HOST_PASSWORD is a 16-digit App Password."
        : `Failed to send: ${msg}`,
    });
  }
}
