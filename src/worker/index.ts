/**
 * Cloudflare Worker with Basic Authentication
 * This worker sits in front of your application and requires basic auth credentials
 */

// Cloudflare Workers types
type ExecutionContext = {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
};

type ExportedHandler<Env = unknown> = {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response>;
  scheduled?(event: ScheduledEvent, env: Env, ctx: ExecutionContext): void | Promise<void>;
};

type ScheduledEvent = {
  scheduledTime: number;
  cron: string;
};

export interface Env {
  AUTH_USERNAME: string;
  AUTH_PASSWORD: string;
  ENVIRONMENT?: string;
}

/**
 * Verify the basic auth credentials
 */
function verifyCredentials(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Decode the base64 credentials
  const base64Credentials = authHeader.slice(6);
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  // Compare with environment variables
  return username === env.AUTH_USERNAME && password === env.AUTH_PASSWORD;
}

/**
 * Create a 401 Unauthorized response with WWW-Authenticate header
 */
function unauthorizedResponse(): Response {
  return new Response('Unauthorized - Basic authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area", charset="UTF-8"',
      'Content-Type': 'text/plain',
    },
  });
}

/**
 * Main worker fetch handler
 */
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Verify credentials
    if (!verifyCredentials(request, env)) {
      return unauthorizedResponse();
    }

    // If authenticated, forward the request to your origin
    // You can customize this to proxy to your actual application
    const url = new URL(request.url);

    // Example: If you're using this with a custom domain/route
    // and want to proxy to your actual app origin
    // const originUrl = new URL(request.url);
    // originUrl.hostname = 'your-actual-app.com';

    // For now, we'll just return a success message
    // In production, you'd typically proxy to your origin server
    return new Response('Authenticated successfully! Configure the origin in the worker.', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  },
} satisfies ExportedHandler<Env>;
