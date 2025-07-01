import { Hono } from "hono";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";

export const TOKEN_DURATION_SECONDS = 8 * 60 * 60; // 8 hours

export const LoginPage = () => {
  return (
    <html>
      <head>
        <title>Admin Login</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100 flex items-center justify-center h-screen">
        <div class="w-full max-w-md">
          <form
            method="post"
            class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="password"
              >
                Password
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="******************"
              />
            </div>
            <div class="flex items-center justify-between">
              <button
                class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </body>
    </html>
  );
};

type AuthBindings = {
  ADMIN_PASS: string;
  JWT_SECRET: string;
};

export const createLoginHandler = () => {
  const app = new Hono<{ Bindings: AuthBindings }>();

  app.post(async (c) => {
    const formData = await c.req.formData();
    const password = formData.get("password");

    if (password === c.env.ADMIN_PASS) {
      const payload = {
        sub: "admin-user",
        exp: Math.floor(Date.now() / 1000) + TOKEN_DURATION_SECONDS,
      };
      const token = await sign(payload, c.env.JWT_SECRET);
      setCookie(c, "token", token, {
        path: "/admin",
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: TOKEN_DURATION_SECONDS,
        sameSite: "Lax",
      });
      return c.redirect("/admin");
    } else {
      // Redirect back to login on failure
      return c.redirect("/admin/login");
    }
  });

  return app;
};
