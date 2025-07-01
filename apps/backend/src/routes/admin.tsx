import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { artworks, posts } from "../db/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import blog from "./admin/blog";
import { jwt } from "hono/jwt";
import { LoginPage, createLoginHandler } from "../auth";

// 2) Describe your Env interface
export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_PASS: string;
  JWT_SECRET: string;
}

export type AdminLayoutProps = {
  children: any;
  title?: string;
  activeTab: "artworks" | "blog";
};

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_PASS: string;
  JWT_SECRET: string;
};

type Variables = {
  db: DrizzleD1Database;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const loginHandler = createLoginHandler();

app.get("/login", (c) => c.html(<LoginPage />));
app.route("/login", loginHandler);

app.use("/*", async (c, next) => {
  const auth = jwt({ secret: c.env.JWT_SECRET, cookie: "token" });
  return auth(c, next);
});

app.use("*", async (c, next) => {
  const db = drizzle(c.env.DB);
  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS artworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT CHECK( category IN ('painting', 'sculpture', 'installation', 'other') ) NOT NULL,
        time TEXT,
        medium TEXT,
        dimension TEXT,
        description TEXT,
        details TEXT
      );
    `);
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        banner_image TEXT NOT NULL,
        tags TEXT,
        "published_at" TEXT NOT NULL
      );
    `);
  } catch (e) {
    // This might fail if the table already exists in some race conditions,
    // but it's fine to ignore since the goal is to have the table.
    console.error("DB init:", e);
  }
  c.set("db", db);
  await next();
});

const AdminLayout = (props: AdminLayoutProps) => {
  return (
    <html>
      <head>
        <title>{props.title || "Admin"}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>
      </head>
      <body class="bg-gray-100 text-gray-800">
        <div class="container mx-auto p-4">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="flex border-b mb-4">
              <a
                href="/admin"
                class={`py-2 px-4 ${
                  props.activeTab === "artworks"
                    ? "border-b-2 border-indigo-500"
                    : ""
                }`}
              >
                Artworks
              </a>
              <a
                href="/admin/blog"
                class={`py-2 px-4 ${
                  props.activeTab === "blog"
                    ? "border-b-2 border-indigo-500"
                    : ""
                }`}
              >
                Blog
              </a>
            </div>
            {props.children}
          </div>
        </div>
      </body>
    </html>
  );
};

app.route("/blog", blog);

app.get("/", async (c) => {
  const db = c.get("db");
  const allArtworks = await db.select().from(artworks).all();
  const r2Files = await c.env.BUCKET.list();

  return c.html(
    <AdminLayout activeTab="artworks">
      <h1 class="text-3xl font-bold mb-6">Artworks</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allArtworks.map((artwork) => (
          <div class="artwork bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 class="text-2xl font-semibold mb-2">{artwork.title}</h2>
            <img
              src={`/admin/file/${artwork.image}`}
              class="w-full h-64 object-cover rounded-md mb-4"
            />
            {artwork.details && artwork.details.length > 0 && (
              <div>
                <h4 class="font-bold mt-2">Details:</h4>
                <div class="flex space-x-2 overflow-x-auto py-2">
                  {artwork.details.map((detailKey) => (
                    <img
                      src={`/admin/file/${detailKey}`}
                      class="w-24 h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
            <p>
              <strong>Category:</strong> {artwork.category}
            </p>
            <p>
              <strong>Time:</strong> {artwork.time}
            </p>
            <p>
              <strong>Medium:</strong> {artwork.medium}
            </p>
            <p>
              <strong>Dimension:</strong> {artwork.dimension}
            </p>
            <div class="prose mt-2">
              <p>{artwork.description?.join("<br>")}</p>
            </div>

            <details class="mt-4">
              <summary class="cursor-pointer font-semibold">
                Edit Artwork
              </summary>
              <form
                action={`/admin/edit/${artwork.id}`}
                method="post"
                enctype="multipart/form-data"
                class="mt-2 space-y-4"
              >
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={artwork.title}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option
                      value="painting"
                      selected={artwork.category === "painting"}
                    >
                      Painting
                    </option>
                    <option
                      value="sculpture"
                      selected={artwork.category === "sculpture"}
                    >
                      Sculpture
                    </option>
                    <option
                      value="installation"
                      selected={artwork.category === "installation"}
                    >
                      Installation
                    </option>
                    <option
                      value="other"
                      selected={artwork.category === "other"}
                    >
                      Other
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={artwork.time || ""}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Medium
                  </label>
                  <input
                    type="text"
                    name="medium"
                    value={artwork.medium || ""}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Dimension
                  </label>
                  <input
                    type="text"
                    name="dimension"
                    value={artwork.dimension || ""}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {artwork.description?.join("\\n")}
                  </textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Main Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Detail Images (re-upload to change)
                  </label>
                  <input
                    type="file"
                    name="details"
                    multiple
                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <button
                  type="submit"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </form>
            </details>
            <form
              action={`/admin/delete/${artwork.id}`}
              method="post"
              class="mt-2"
              onsubmit="return confirm('Are you sure you want to delete this artwork?');"
            >
              <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-2xl font-bold mb-4">Create New Artwork</h2>
        <form
          action="/admin/create"
          method="post"
          enctype="multipart/form-data"
          class="space-y-4"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="painting">Painting</option>
              <option value="sculpture">Sculpture</option>
              <option value="installation">Installation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="text"
              name="time"
              placeholder="Time"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Medium
            </label>
            <input
              type="text"
              name="medium"
              placeholder="Medium"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Dimension
            </label>
            <input
              type="text"
              name="dimension"
              placeholder="Dimension"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Main Image
            </label>
            <input
              type="file"
              name="image"
              required
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Detail Images
            </label>
            <input
              type="file"
              name="details"
              multiple
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create
          </button>
        </form>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-200">
        <h2 class="text-2xl font-bold mb-4">Files in R2</h2>
        <ul class="list-disc list-inside">
          {r2Files.objects.map((file) => (
            <li>
              <a
                href={`/admin/file/${file.key}`}
                class="text-indigo-600 hover:underline"
              >
                {file.key}
              </a>
            </li>
          ))}
        </ul>
      </div>
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
  const detailFiles = formData.getAll("details") as File[];
  const category = formData.get("category") as
    | "painting"
    | "sculpture"
    | "installation"
    | "other";

  if (image && title) {
    const imageKey = `${Date.now()}-${image.name}`;
    await c.env.BUCKET.put(imageKey, await image.arrayBuffer());

    const detailKeys: string[] = [];
    for (const file of detailFiles) {
      if (file.size > 0) {
        const detailKey = `${Date.now()}-detail-${file.name}`;
        await c.env.BUCKET.put(detailKey, await file.arrayBuffer());
        detailKeys.push(detailKey);
      }
    }

    await db.insert(artworks).values({
      image: imageKey,
      title,
      time,
      medium,
      dimension,
      description,
      details: detailKeys,
      category,
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
  const detailFiles = formData.getAll("details") as File[];
  const category = formData.get("category") as
    | "painting"
    | "sculpture"
    | "installation"
    | "other";

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

    const detailKeys: string[] = artwork.details || [];
    if (detailFiles.some((f) => f.size > 0)) {
      // Delete old detail images if new ones are uploaded
      if (artwork.details && artwork.details.length > 0) {
        await c.env.BUCKET.delete(artwork.details);
      }
      // Upload new detail images
      const newDetailKeys: string[] = [];
      for (const file of detailFiles) {
        if (file.size > 0) {
          const detailKey = `${Date.now()}-detail-${file.name}`;
          await c.env.BUCKET.put(detailKey, await file.arrayBuffer());
          newDetailKeys.push(detailKey);
        }
      }
      detailKeys.splice(0, detailKeys.length, ...newDetailKeys);
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
        details: detailKeys,
        category,
      })
      .where(sql`id = ${id}`);
  }

  return c.redirect("/admin");
});

app.post("/delete/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));

  const artwork = await db
    .select()
    .from(artworks)
    .where(sql`id = ${id}`)
    .get();

  if (artwork) {
    // Delete main image
    const keysToDelete = [artwork.image];

    // Add detail images to the deletion list
    if (artwork.details && artwork.details.length > 0) {
      keysToDelete.push(...artwork.details);
    }

    // Delete all images from R2
    if (keysToDelete.length > 0) {
      await c.env.BUCKET.delete(keysToDelete);
    }

    // Delete from DB
    await db.delete(artworks).where(sql`id = ${id}`);
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
