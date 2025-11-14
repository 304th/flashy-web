export const onRequest = async (context: TODO) => {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const cookies = request.headers.get("Cookie") || "";

  const VALID_USER = env.BASIC_USER || "flashy";
  const VALID_PASS = env.BASIC_PASS || "veryflashy";

  const session = cookies
    .split(";")
    .find((cookie: string) => cookie.trim().startsWith("auth_session="))
    ?.split("=")[1];

  const isValidSession = session === btoa(`${VALID_USER}:${VALID_PASS}`);

  if (url.pathname === "/login.html") {
    return next();
  }

  if (request.method === "POST" && url.pathname === "/") {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    if (username === VALID_USER && password === VALID_PASS) {
      const response = Response.redirect("/", 302);
      response.headers.set(
        "Set-Cookie",
        `auth_session=${btoa(`${username}:${password}`)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
      );
      return response;
    } else {
      return Response.redirect("/login.html?error=1", 302);
    }
  }

  if (isValidSession) {
    return next();
  }

  return next();
};