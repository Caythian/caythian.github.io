import { drizzle } from "drizzle-orm/d1";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1) Define the artworks table
const artworks = sqliteTable("artworks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  image: text("image").notNull(),
  title: text("title").notNull(),
  time: text("time"),
  medium: text("medium"),
  dimension: text("dimension"),
  description: text("description", { mode: "json" }).$type<string[]>(),
  details: text("details", { mode: "json" }).$type<string[]>(),
});

// 2) Describe your Env interface
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB);
    const url = new URL(request.url);

    if (url.pathname === "/admin") {
      const allArtworks = await db.select().from(artworks).all();
      const r2Files = await env.BUCKET.list();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Admin</title>
          <style>
            body { font-family: sans-serif; }
            .container { max-width: 800px; margin: 0 auto; }
            .artwork { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
            .artwork img { max-width: 200px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Artworks</h1>
            ${allArtworks
              .map(
                (artwork) => `
              <div class="artwork">
                <h2>${artwork.title}</h2>
                <img src="/admin/file/${artwork.image}" />
                <p>Time: ${artwork.time}</p>
                <p>Medium: ${artwork.medium}</p>
                <p>Dimension: ${artwork.dimension}</p>
                <p>Description: ${artwork.description?.join("<br>")}</p>
                <p>Details: ${artwork.details?.join(", ")}</p>
                <form action="/admin/edit/${artwork.id}" method="post" enctype="multipart/form-data">
                  <input type="hidden" name="id" value="${artwork.id}" />
                  <input type="text" name="title" value="${artwork.title}" />
                  <input type="text" name="time" value="${artwork.time}" />
                  <input type="text" name="medium" value="${artwork.medium}" />
                  <input type="text" name="dimension" value="${artwork.dimension}" />
                  <textarea name="description">${artwork.description?.join("\n")}</textarea>
                  <input type="file" name="image" />
                  <button type="submit">Update</button>
                </form>
              </div>
            `,
              )
              .join("")}
            <h2>Create New Artwork</h2>
            <form action="/admin/create" method="post" enctype="multipart/form-data">
              <input type="text" name="title" placeholder="Title" />
              <input type="text" name="time" placeholder="Time" />
              <input type="text" name="medium" placeholder="Medium" />
              <input type="text" name="dimension" placeholder="Dimension" />
              <textarea name="description" placeholder="Description"></textarea>
              <input type="file" name="image" />
              <button type="submit">Create</button>
            </form>
            <h2>Files in R2</h2>
            <ul>
              ${r2Files.objects.map((file) => `<li><a href="/admin/file/${file.key}">${file.key}</a></li>`).join("")}
            </ul>
          </div>
        </body>
        </html>
      `;
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    }

    if (url.pathname === "/admin/create" && request.method === "POST") {
      const formData = await request.formData();
      const image = formData.get("image") as File;
      const title = formData.get("title") as string;
      const time = formData.get("time") as string;
      const medium = formData.get("medium") as string;
      const dimension = formData.get("dimension") as string;
      const description = (formData.get("description") as string).split("\n");

      if (image) {
        const imageKey = `${Date.now()}-${image.name}`;
        await env.BUCKET.put(imageKey, await image.arrayBuffer());

        await db.insert(artworks).values({
          image: imageKey,
          title,
          time,
          medium,
          dimension,
          description,
          details: [],
        });
      }

      return new Response(null, {
        status: 302,
        headers: { Location: "/admin" },
      });
    }

    if (url.pathname.startsWith("/admin/edit/") && request.method === "POST") {
      const id = parseInt(url.pathname.split("/").pop() || "0");
      const formData = await request.formData();
      const image = formData.get("image") as File;
      const title = formData.get("title") as string;
      const time = formData.get("time") as string;
      const medium = formData.get("medium") as string;
      const dimension = formData.get("dimension") as string;
      const description = (formData.get("description") as string).split("\n");

      const artwork = await db
        .select()
        .from(artworks)
        .where(sql`id = ${id}`)
        .get();

      if (artwork) {
        let imageKey = artwork.image;
        if (image && image.size > 0) {
          // Delete old image
          await env.BUCKET.delete(artwork.image);
          // Upload new image
          imageKey = `${Date.now()}-${image.name}`;
          await env.BUCKET.put(imageKey, await image.arrayBuffer());
        }

        await db
          .update(artworks)
          .set({
            image: imageKey,
            title,
            time,
            medium,
            dimension,
            description,
          })
          .where(sql`id = ${id}`);
      }

      return new Response(null, {
        status: 302,
        headers: { Location: "/admin" },
      });
    }

    // Route to create the artworks table if it doesn't exist
    if (url.pathname === "/setup") {
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
      return new Response("Table 'artworks' created or already exists!");
    }

    // Route to add a test artwork
    if (url.pathname === "/add") {
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

      return Response.json(newArtwork);
    }

    // Route to get all artworks
    if (url.pathname === "/artworks") {
      const allArtworks = await db.select().from(artworks).all();
      return Response.json(allArtworks);
    }

    if (url.pathname === "/admin/files") {
      const list = await env.BUCKET.list();
      const files = list.objects.map((obj) => obj.key).join("\n");
      return new Response(files, { headers: { "Content-Type": "text/plain" } });
    }

    if (url.pathname.startsWith("/admin/file/")) {
      const key = url.pathname.substring("/admin/file/".length);
      const object = await env.BUCKET.get(key);

      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);

      return new Response(object.body, {
        headers,
      });
    }

    // Default route
    return new Response("D1 Connected!");
  },
};
