import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { artworks } from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

type Variables = {
  db: DrizzleD1Database;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("*", async (c, next) => {
  const db = drizzle(c.env.DB);
  c.set("db", db);
  await next();
});

// Route to get all artworks or by category
app.get("/artworks/:category?", async (c) => {
  const db = c.get("db");
  const category = c.req.param("category");

  let query = db.select().from(artworks);

  if (category) {
    // @ts-ignore
    query = query.where(sql`${artworks.category} = ${category}`);
  }

  const allArtworks = await query.all();
  return c.json(allArtworks);
});

app.get("/image/:key", async (c) => {
  const key = c.req.param("key");
  const object = await c.env.BUCKET.get(key);

  if (object === null) {
    return c.notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return c.body(object.body, {
    headers,
  });
});

export default app;

