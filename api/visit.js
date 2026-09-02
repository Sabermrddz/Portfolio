import { sendVisitorEmail } from './_visitor-helper.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = process.env.EMAIL_HOST_USER;
  const pass = process.env.EMAIL_HOST_PASSWORD;

  if (!user || !pass || user.includes("your-actual") || pass.includes("your-16")) {
    return res.status(500).json({ error: "Email not configured. Set real EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env." });
  }

  try {
    const payload = {
      ...(req.body || {}),
      userAgent: req.body?.userAgent || req.headers["user-agent"] || "Unknown",
      page: req.body?.page || req.headers.referer || "Unknown",
      language: req.body?.language || req.headers["accept-language"] || "Unknown",
      timezone: req.body?.timezone || "Africa/Algiers",
      ipAddress: req.body?.ipAddress || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "Unknown",
    };

    const mockReq = {
      headers: {
        ...req.headers,
        "user-agent": payload.userAgent,
        "accept-language": payload.language,
        referer: payload.page,
        "x-forwarded-for": payload.ipAddress,
      },
      socket: req.socket,
    };

    const result = await sendVisitorEmail({
      req: mockReq,
      res: null, // The helper doesn't call methods on res
      user,
      pass,
      appName: "Portfolio Visitor",
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to send visitor email:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: `Visitor email failed: ${msg}` });
  }
}
