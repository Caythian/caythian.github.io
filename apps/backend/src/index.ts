import { Hono } from "hono";
import admin from "./routes/admin";
import api from "./routes/api";

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

app.route("/admin", admin);
app.route("/", api);

export default app;
