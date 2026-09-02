import { app } from '@azure/functions';
import { sendVisitorEmail } from '../visitor.js';

app.http('visit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const user = process.env.EMAIL_HOST_USER;
        const pass = process.env.EMAIL_HOST_PASSWORD;

        if (!user || !pass || user.includes("your-actual") || pass.includes("your-16")) {
            return {
                status: 500,
                jsonBody: {
                    error: "Email not configured. Set real EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env.",
                }
            };
        }

        try {
            let body = {};
            try {
                body = await request.json();
            } catch (e) {
                // Ignore parsing errors for empty body
            }

            const userAgent = body?.userAgent || request.headers.get("user-agent") || "Unknown";
            const page = body?.page || request.headers.get("referer") || "Unknown";
            const language = body?.language || request.headers.get("accept-language") || "Unknown";
            const timezone = body?.timezone || "Africa/Algiers";
            const ipAddress = body?.ipAddress || request.headers.get("x-forwarded-for") || "Unknown";

            const mockReq = {
                headers: {
                    "user-agent": userAgent,
                    "accept-language": language,
                    "referer": page,
                    "x-forwarded-for": ipAddress
                },
                socket: {
                    remoteAddress: ipAddress
                }
            };

            const result = await sendVisitorEmail({
                req: mockReq,
                res: null, // visitor.js takes res but does not call any methods on it
                user,
                pass,
                appName: "Portfolio Visitor",
            });

            return { status: 200, jsonBody: result };
        } catch (error) {
            context.error("Failed to send visitor email:", error);
            const msg = error instanceof Error ? error.message : String(error);
            return { status: 500, jsonBody: { error: `Visitor email failed: ${msg}` } };
        }
    }
});
