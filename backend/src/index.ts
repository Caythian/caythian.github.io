import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello frome Hono!");
});

export default app;
