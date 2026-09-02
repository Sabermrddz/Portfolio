export interface VisitorEmailData {
  ipAddress?: string;
  device?: string;
  browser?: string;
  os?: string;
  screen?: string;
  language?: string;
  timezone?: string;
  page?: string;
  country?: string;
  city?: string;
  userAgent?: string;
}

export function detectVisitorDevice(userAgent?: string): {
  device: string;
  browser: string;
  os: string;
};

export function buildVisitorEmailHtml(data: VisitorEmailData): string;

export function escapeHtml(str?: string): string;

export function sendVisitorEmail(args: {
  req: any;
  res: any;
  user: string;
  pass: string;
  appName?: string;
}): Promise<{
  success: true;
  messageId: string;
}>;
