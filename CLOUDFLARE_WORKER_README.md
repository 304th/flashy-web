# Cloudflare Worker with Basic Authentication

This Cloudflare Worker adds basic authentication to protect your application.

## Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Set Authentication Credentials

You need to set the username and password as secrets in Cloudflare:

```bash
# Set the username
wrangler secret put AUTH_USERNAME

# Set the password
wrangler secret put AUTH_PASSWORD
```

When prompted, enter your desired credentials.

### 4. Deploy the Worker

```bash
wrangler deploy
```

## Configuration

### wrangler.toml

The configuration is in `wrangler.toml`. Key settings:

- `name`: The name of your worker
- `main`: Path to the worker script
- `compatibility_date`: API compatibility date

### Environment Variables

The worker uses these environment variables:

- `AUTH_USERNAME`: The username for basic auth (set as secret)
- `AUTH_PASSWORD`: The password for basic auth (set as secret)

## Customizing the Worker

### Proxying to Your Origin

To proxy authenticated requests to your actual application, modify the `fetch` handler in `src/worker/index.ts`:

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!verifyCredentials(request, env)) {
      return unauthorizedResponse();
    }

    // Proxy to your origin server
    const url = new URL(request.url);
    url.hostname = 'your-actual-app.com'; // Change this to your origin

    return fetch(url.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  },
}
```

### Excluding Certain Routes

To bypass authentication for specific routes (e.g., health checks, public assets):

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Skip auth for certain paths
    if (url.pathname.startsWith('/public') || url.pathname === '/health') {
      return fetch(request);
    }

    // Verify credentials for other routes
    if (!verifyCredentials(request, env)) {
      return unauthorizedResponse();
    }

    return fetch(request);
  },
}
```

## Testing Locally

Run the worker locally for testing:

```bash
wrangler dev
```

This will start a local server. Test with curl:

```bash
# Without credentials (should fail)
curl http://localhost:8787

# With credentials (should succeed)
curl -u username:password http://localhost:8787
```

## Deployment Environments

The configuration includes two environments:

- `development`: For testing
- `production`: For live deployment

Deploy to specific environment:

```bash
wrangler deploy --env production
```

## Security Notes

- Store credentials as Wrangler secrets (never commit them to git)
- Use strong passwords for production
- Consider using allowlists/denylists for IP-based access control
- Monitor authentication failures in Cloudflare Analytics
- Consider adding rate limiting to prevent brute force attacks

## Adding to Your Domain

After deployment, configure the worker route in Cloudflare Dashboard:

1. Go to your domain in Cloudflare Dashboard
2. Navigate to Workers Routes
3. Add a route pattern (e.g., `example.com/*`)
4. Select your worker

Or use wrangler.toml:

```toml
routes = [
  { pattern = "example.com/*", zone_name = "example.com" }
]
```
