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

  if (url.pathname === '/login.html') {
    return next();
  }

  if (request.method === 'POST' && url.pathname === '/') {
    const form = await request.formData();
    const u = form.get('username');
    const p = form.get('password');

    if (u === USER && p === PASS) {
      const resp = Response.redirect('/', 302);
      resp.headers.set(
        'Set-Cookie',
        `auth_session=${btoa(`${u}:${p}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      );
      return resp;
    } else {
      return Response.redirect('/login.html?error=1', 302);
    }
  }

  if (isLoggedIn) {
    return next();
  }

  return Response.redirect('/login.html', 302);
};