import { app } from '@azure/functions';

app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const emailConfigured = !!(process.env.EMAIL_HOST_USER && process.env.EMAIL_HOST_PASSWORD);
        return {
            status: 200,
            jsonBody: { status: "ok", emailConfigured }
        };
    }
});
