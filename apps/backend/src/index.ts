import { Hono } from "hono";
import admin from "./routes/admin";
import api from "./routes/api";
import {
  getAssetFromKV,
  serveSinglePageApp,
} from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
const manifest = JSON.parse(manifestJSON);

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  __STATIC_CONTENT: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

app.route("/admin", admin);
app.route("/api", api);

app.get("*", async (c) => {
  try {
    return await getAssetFromKV(
      {
        request: c.req.raw,
        waitUntil: (promise) => c.executionCtx.waitUntil(promise),
      },
      {
        ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
        ASSET_MANIFEST: manifest,
        mapRequestToAsset: serveSinglePageApp,
      },
    );
  } catch (e) {
    console.error(e);
    return c.text("An unexpected error occurred", 500);
  }
});

export default app;
