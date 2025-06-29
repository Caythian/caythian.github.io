import { Hono } from "hono";
import { jsx } from "hono/jsx";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { artworks } from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

// 2) Describe your Env interface
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

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

const AdminLayout = (props: { children: any }) => {
  return (
    <html>
      <head>
        <title>Admin</title>
        <style>
          {`
            body { font-family: sans-serif; }
            .container { max-width: 800px; margin: 0 auto; }
            .artwork { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
            .artwork img { max-width: 200px; }
          `}
        </style>
      </head>
      <body>
        <div class="container">{props.children}</div>
      </body>
    </html>
  );
};

app.get("/", async (c) => {
  const db = c.get("db");
  const allArtworks = await db.select().from(artworks).all();
  const r2Files = await c.env.BUCKET.list();

  return c.html(
    <AdminLayout>
      <h1>Artworks</h1>
      {allArtworks.map((artwork) => (
        <div class="artwork">
          <h2>{artwork.title}</h2>
          <img src={`/admin/file/${artwork.image}`} />
          <p>Time: {artwork.time}</p>
          <p>Medium: {artwork.medium}</p>
          <p>Dimension: {artwork.dimension}</p>
          <p>Description: {artwork.description?.join("<br>")}</p>
          <p>Details: {artwork.details?.join(", ")}</p>
          <form
            action={`/admin/edit/${artwork.id}`}
            method="post"
            enctype="multipart/form-data"
          >
            <input type="hidden" name="id" value={artwork.id} />
            <input type="text" name="title" value={artwork.title} />
            <input type="text" name="time" value={artwork.time || ""} />
            <input type="text" name="medium" value={artwork.medium || ""} />
            <input
              type="text"
              name="dimension"
              value={artwork.dimension || ""}
            />
            <textarea name="description">
              {artwork.description?.join("\\n")}
            </textarea>
            <input type="file" name="image" />
            <button type="submit">Update</button>
          </form>
        </div>
      ))}
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
        {r2Files.objects.map((file) => (
          <li>
            <a href={`/admin/file/${file.key}`}>{file.key}</a>
          </li>
        ))}
      </ul>
    </AdminLayout>,
  );
});

app.post("/create", async (c) => {
  const db = c.get("db");
  const formData = await c.req.formData();
  const image = formData.get("image") as File;
  const title = formData.get("title") as string;
  const time = formData.get("time") as string;
  const medium = formData.get("medium") as string;
  const dimension = formData.get("dimension") as string;
  const description = (formData.get("description") as string).split("\\n");

  if (image) {
    const imageKey = `${Date.now()}-${image.name}`;
    await c.env.BUCKET.put(imageKey, await image.arrayBuffer());

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

  return c.redirect("/admin");
});

app.post("/edit/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const formData = await c.req.formData();
  const image = formData.get("image") as File;
  const title = formData.get("title") as string;
  const time = formData.get("time") as string;
  const medium = formData.get("medium") as string;
  const dimension = formData.get("dimension") as string;
  const description = (formData.get("description") as string).split("\\n");

  const artwork = await db
    .select()
    .from(artworks)
    .where(sql`id = ${id}`)
    .get();

  if (artwork) {
    let imageKey = artwork.image;
    if (image && image.size > 0) {
      // Delete old image
      await c.env.BUCKET.delete(artwork.image);
      // Upload new image
      imageKey = `${Date.now()}-${image.name}`;
      await c.env.BUCKET.put(imageKey, await image.arrayBuffer());
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

  return c.redirect("/admin");
});

app.get("/file/:key", async (c) => {
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
