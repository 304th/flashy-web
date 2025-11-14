export const onRequest = async (context: TODO) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const cookies = request.headers.get('Cookie') || '';

  const USER = env.BASIC_USER || 'flashy';
  const PASS = env.BASIC_PASS || 'veryflashy';

  const session = cookies
    .split(';')
    .find((cookie: string) => cookie.trim().startsWith('auth_session='))
    ?.split('=')[1];

  const isLoggedIn = session === btoa(`${USER}:${PASS}`);
  console.log('Request:', url.pathname, 'Logged in:', isLoggedIn);

  // Allow login page and public assets to bypass auth
  const isPublicAsset =
    url.pathname === '/login.html' ||
    url.pathname === '/favicon.ico' ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/_worker.js') ||
    /\.(svg|png|jpg|jpeg|gif|css|js|ico|woff|woff2|ttf|eot|json)$/i.test(url.pathname);

  if (isPublicAsset) {
    return next();
  }

  if (request.method === 'POST' && url.pathname === '/') {
    const form = await request.formData();
    const user = form.get('username');
    const password = form.get('password');

    if (user === USER && password === PASS) {
      const resp = Response.redirect(new URL('/', url.origin).toString(), 302);
      resp.headers.set(
        'Set-Cookie',
        `auth_session=${btoa(`${user}:${password}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
      );
      return resp;
    } else {
      return Response.redirect(new URL('/login.html?error=1', url.origin).toString(), 302);
    }
  }

  if (isLoggedIn) {
    return next();
  }

  return Response.redirect(new URL('/login.html', url.origin).toString(), 302);
};