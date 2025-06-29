import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { artworks, posts } from "../db/schema";
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

app.get("/posts/tags", async (c) => {
  const db = c.get("db");
  const allPosts = await db.select({ tags: posts.tags }).from(posts).all();
  const allTags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags?.forEach((tag) => {
      allTags.add(tag);
    });
  });
  return c.json(Array.from(allTags));
});

app.get("/posts/:tagOrId", async (c) => {
  const db = c.get("db");
  const tagOrId = c.req.param("tagOrId");

  const id = parseInt(tagOrId, 10);
  if (!isNaN(id)) {
    const post = await db.select().from(posts).where(sql`id = ${id}`).get();
    return c.json(post);
  }

  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(sql`${posts.publishedAt} DESC`)
    .all();

  const filteredPosts = allPosts.filter((p) => p.tags?.includes(tagOrId));
  return c.json(filteredPosts);
});

app.get("/posts", async (c) => {
  const db = c.get("db");
  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(sql`${posts.publishedAt} DESC`)
    .all();
  return c.json(allPosts);
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

