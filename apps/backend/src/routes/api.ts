import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { artworks } from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

type Bindings = {
  DB: D1Database;
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

// Route to get all artworks
app.get("/artworks", async (c) => {
  const db = c.get("db");
  const allArtworks = await db.select().from(artworks).all();
  return c.json(allArtworks);
});

// Route to create the artworks table if it doesn't exist
app.get("/setup", async (c) => {
  const db = c.get("db");
  await db.run(sql`
        CREATE TABLE IF NOT EXISTS artworks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          image TEXT NOT NULL,
          title TEXT NOT NULL,
          time TEXT,
          medium TEXT,
          dimension TEXT,
          description TEXT,
          details TEXT
        )
      `);
  return c.text("Table 'artworks' created or already exists!");
});

// Route to add a test artwork
app.get("/add", async (c) => {
  const db = c.get("db");
  const newArtwork = await db
    .insert(artworks)
    .values({
      image: "test.jpg",
      title: "Test Artwork",
      time: "2025",
      medium: "Oil on canvas",
      dimension: "100x100 cm",
      description: [
        "This is a test description.",
        "It has multiple paragraphs.",
      ],
      details: ["detail1.jpg", "detail2.jpg"],
    })
    .returning()
    .get();

  return c.json(newArtwork);
});

export default app;

