import { createTransport } from 'nodemailer';

export function detectVisitorDevice(userAgent = '') {
  const ua = userAgent.toLowerCase();

  const browser =
    /edg\//.test(ua) ? 'Edge' :
    /opr\//.test(ua) ? 'Opera' :
    /chrome\//.test(ua) ? 'Chrome' :
    /safari\//.test(ua) ? 'Safari' :
    /firefox\//.test(ua) ? 'Firefox' :
    /msie|trident\//.test(ua) ? 'Internet Explorer' :
    'Unknown';

  const os =
    /windows/.test(ua) ? 'Windows' :
    /android/.test(ua) ? 'Android' :
    /iphone|ipad|ipod/.test(ua) ? 'iOS' :
    /mac/.test(ua) ? 'macOS' :
    /linux/.test(ua) ? 'Linux' :
    'Unknown';

  const device =
    /mobile|android|iphone|ipad|ipod/.test(ua) ? 'Mobile' :
    /tablet|ipad/.test(ua) ? 'Tablet' :
    'Desktop';

  return { device, browser, os };
}

export function buildVisitorEmailHtml(data) {
  const rows = [
    ['IP Address', data.ipAddress || 'Unknown'],
    ['Device', data.device || 'Unknown'],
    ['Browser', data.browser || 'Unknown'],
    ['Operating System', data.os || 'Unknown'],
    ['Screen', data.screen || 'Unknown'],
    ['Language', data.language || 'Unknown'],
    ['Timezone', data.timezone || 'Unknown'],
    ['Page', data.page || 'Unknown'],
    ['Country', data.country || 'Unknown'],
    ['City', data.city || 'Unknown'],
  ];

  const rowsHtml = rows
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 0;color:#8a8880;font-size:12px;letter-spacing:0.1em;vertical-align:top">${label.toUpperCase()}</td>
        <td style="padding:8px 0;color:#ece9e2;font-weight:600;vertical-align:top;word-break:break-word">${escapeHtml(String(value))}</td>
      </tr>
    `)
    .join('');

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;background:#0a0a0a;color:#ece9e2;border-radius:18px;border:1px solid #242424">
      <h2 style="margin:0 0 12px;font-size:22px;color:#d4ff3f">🌐 New Website Visitor</h2>
      <p style="margin:0 0 18px;color:#8a8880;font-size:13px">A visitor entered your website and the details below were captured.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:18px">
        ${rowsHtml}
      </table>
      <div style="margin-top:18px;padding:16px;background:#121212;border:1px solid #242424;border-radius:12px">
        <p style="margin:0 0 8px;color:#8a8880;font-size:11px;letter-spacing:0.15em">USER-AGENT</p>
        <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:#ece9e2;font-size:12px;word-break:break-word">${escapeHtml(data.userAgent || 'Unknown')}</p>
      </div>
    </div>
  `;
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendVisitorEmail({ req, res, user, pass, appName = 'Portfolio Visitor' }) {
  const headers = req.headers || {};
  const userAgent = headers['user-agent'] || 'Unknown';
  const forwardedFor = headers['x-forwarded-for'];
  const ipAddress = Array.isArray(forwardedFor) ? forwardedFor[0] : (forwardedFor || req.socket?.remoteAddress || 'Unknown');

  const language = headers['accept-language'] || 'Unknown';
  const page = (req.headers.referer && req.headers.referer !== 'undefined') ? req.headers.referer : 'Unknown';
  const timezone = 'Africa/Algiers';

  const { device, browser, os } = detectVisitorDevice(String(userAgent));
  const screen = 'Unknown';

  const transporter = createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `"${appName}" <${user}>`,
    to: user,
    subject: '🌐 New Website Visitor',
    text: [
      '🌐 New Website Visitor',
      '',
      `IP Address: ${ipAddress}`,
      `Device: ${device}`,
      `Browser: ${browser}`,
      `Operating System: ${os}`,
      `Screen: ${screen}`,
      `Language: ${language}`,
      `Timezone: ${timezone}`,
      `Page: ${page}`,
      '',
      'User-Agent:',
      String(userAgent),
    ].join('\n'),
    html: buildVisitorEmailHtml({
      ipAddress: String(ipAddress),
      device,
      browser,
      os,
      screen,
      language: String(language),
      timezone,
      page: String(page),
      userAgent: String(userAgent),
    }),
  });

  return { success: true, messageId: info.messageId };
}
