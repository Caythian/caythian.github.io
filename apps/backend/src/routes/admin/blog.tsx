import { Hono } from "hono";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
import { posts } from "../../db/schema";
import type { Env, AdminLayoutProps } from "../admin";

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

type Variables = {
  db: DrizzleD1Database;
};

const blog = new Hono<{ Bindings: Bindings; Variables: Variables }>();

const AdminLayout = (props: AdminLayoutProps) => {
  return (
    <html>
      <head>
        <title>{props.title || "Admin"}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
          rel="stylesheet"
        />
        <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC&family=Playfair+Display&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .ql-font-noto-sans { font-family: 'Noto Serif SC', sans-serif; }
          .ql-font-playfair { font-family: 'Playfair Display', serif; }

          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="noto-sans"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="noto-sans"]::before {
            content: 'Noto Serif SC';
            font-family: 'Noto Serif SC', sans-serif;
          }
          .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="playfair"]::before,
          .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="playfair"]::before {
            content: 'Playfair';
            font-family: 'Playfair Display', serif;
          }

          .ql-size-title { font-size: 32px; font-weight: bold; }
          .ql-size-subtitle { font-size: 40px; font-weight: bold; }
          .ql-size-body { font-size: 16px; }
          .ql-size-caption { font-size: 12px; color: #00000090; }

          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="body"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="body"]::before { content: 'Body'; font-size: 16px; }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="title"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="title"]::before { content: 'Title'; font-size: 24px; font-weight: bold; }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="subtitle"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="subtitle"]::before { content: 'Subtitle'; font-size: 20px; font-weight: bold; }
          .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="caption"]::before,
          .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="caption"]::before { content: 'Caption'; font-size: 12px; }
          .ql-snow .ql-picker.ql-size .ql-picker-label::before { content: 'Body'; }
        `,
          }}
        ></style>
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

// Blog Section
blog.get("/", async (c) => {
  const db = c.get("db");
  const allPosts = await db.select().from(posts).all();

  return c.html(
    <AdminLayout activeTab="blog">
      <h1 class="text-3xl font-bold mb-6">Blog</h1>
      <div class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold mb-4">Create New Post</h2>
          <form
            action="/admin/blog/create"
            method="post"
            enctype="multipart/form-data"
            class="space-y-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Published Date
              </label>
              <input
                type="date"
                name="publishedAt"
                value={new Date().toISOString().split("T")[0]}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Content
              </label>
              <input type="hidden" name="content" />
              <div id="editor" class="mt-1 block w-full h-64"></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Banner Image
              </label>
              <input
                type="file"
                name="bannerImage"
                required
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Post
            </button>
          </form>
        </div>

        <div class="border-t pt-8">
          <h2 class="text-2xl font-bold mb-4">Existing Posts</h2>
          <div class="space-y-6">
            {allPosts.map((post) => (
              <div class="p-4 border rounded-lg">
                <h3 class="text-xl font-semibold">{post.title}</h3>
                <img
                  src={`/admin/file/${post.bannerImage}`}
                  alt="Banner Image"
                  class="my-4 w-full h-auto max-h-48 object-cover rounded-md"
                />
                <p class="text-sm text-gray-500">
                  Published on:{" "}
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <p class="text-sm text-gray-500">
                    Tags: {post.tags.join(", ")}
                  </p>
                )}
                <div
                  class="prose mt-2"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                ></div>
                <details class="mt-4">
                  <summary class="cursor-pointer font-semibold">
                    Edit Post
                  </summary>
                  <form
                    action={`/admin/blog/edit/${post.id}`}
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
                        value={post.title}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={post.tags?.join(", ")}
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Published Date
                      </label>
                      <input
                        type="date"
                        name="publishedAt"
                        value={
                          new Date(post.publishedAt).toISOString().split("T")[0]
                        }
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <input
                        type="hidden"
                        name="content"
                        value={post.content}
                      />
                      <div
                        id={`editor-${post.id}`}
                        class="mt-1 block w-full h-64"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      ></div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        Banner Image (re-upload to change)
                      </label>
                      <input
                        type="file"
                        name="bannerImage"
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                    <button
                      type="submit"
                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Update Post
                    </button>
                  </form>
                </details>
                <form
                  action={`/admin/blog/delete/${post.id}`}
                  method="post"
                  class="mt-2"
                  onsubmit="return confirm('Are you sure you want to delete this post?');"
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
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', () => {
              const quills = {};
              
              function imageHandler() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
  
                input.onchange = async () => {
                  const file = input.files[0];
                  if (/^image\\//.test(file.type)) {
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    const response = await fetch('/admin/blog/upload', {
                      method: 'POST',
                      body: formData
                    });
                    
                    if(response.ok) {
                      const { key } = await response.json();
                      const range = this.quill.getSelection(true);
                      this.quill.insertEmbed(range.index, 'image', '/admin/file/' + key);
                    } else {
                      console.error('Upload failed');
                    }
                  } else {
                    console.warn('You could only upload images.');
                  }
                };
              }
  
              const Font = Quill.import('attributors/class/font');
              const fonts = ['noto-sans', 'playfair'];
              Font.whitelist = fonts;
              Quill.register(Font, true);

              const Size = Quill.import('attributors/class/size');
              Size.whitelist = ['title', 'subtitle', 'body', 'caption'];
              Quill.register(Size, true);
  
              const toolbarOptions = {
                container: [
                  [{ 'font': fonts }, { 'size': [ 'body', 'title', 'subtitle', 'caption'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['link', 'image', 'video'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  [{ 'align': [] }],
                  ['clean']
                ],
                handlers: {
                  image: imageHandler
                }
              };
              
              const createQuill = (selector, form) => {
                if (quills[selector]) {
                  return;
                }
  
                const editor = document.querySelector(selector);
                if (editor) {
                  const quill = new Quill(editor, {
                    modules: { toolbar: toolbarOptions },
                    theme: 'snow'
                  });
                  
                  form.addEventListener('submit', function(e) {
                    const contentInput = form.querySelector('input[name="content"]');
                    contentInput.value = quill.root.innerHTML;
                  });
  
                  quills[selector] = quill;

                  const initialContent = form.querySelector('input[name="content"]').value;
                  if (!initialContent) {
                    quill.format('size', 'body');
                  }
                }
              };
  
              createQuill('#editor', document.querySelector('form[action="/admin/blog/create"]'));
              
              document.querySelectorAll('details').forEach(detail => {
                detail.addEventListener('toggle', event => {
                  if (detail.open) {
                    const form = detail.querySelector('form');
                    if(form) {
                      const editorDiv = form.querySelector('div[id^="editor-"]');
                      if (editorDiv) {
                        createQuill('#' + editorDiv.id, form);
                      }
                    }
                  }
                });
              });
            });
          `,
        }}
      ></script>
    </AdminLayout>,
  );
});

blog.post("/create", async (c) => {
  const db = c.get("db");
  const formData = await c.req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const bannerImage = formData.get("bannerImage");
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);
  const publishedAt = formData.get("publishedAt") as string;

  if (
    !(title && content && bannerImage instanceof File && bannerImage.size > 0)
  ) {
    return c.text("Title, content, and banner image are required.", 400);
  }

  const bannerImageKey = `${Date.now()}-banner-${bannerImage.name}`;
  await c.env.BUCKET.put(bannerImageKey, await bannerImage.arrayBuffer());

  await db.insert(posts).values({
    title,
    content,
    bannerImage: bannerImageKey,
    tags,
    publishedAt: new Date(publishedAt).toISOString(),
  });

  return c.redirect("/admin/blog");
});

blog.post("/edit/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const formData = await c.req.formData();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const bannerImage = formData.get("bannerImage");
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t);
  const publishedAt = formData.get("publishedAt") as string;

  if (!title || !content) {
    return c.text("Title and content cannot be empty.", 400);
  }

  const post = await db
    .select()
    .from(posts)
    .where(sql`id = ${id}`)
    .get();

  if (!post) {
    return c.notFound();
  }

  let bannerImageKey = post.bannerImage;
  if (bannerImage instanceof File && bannerImage.size > 0) {
    await c.env.BUCKET.delete(post.bannerImage);
    bannerImageKey = `${Date.now()}-banner-${bannerImage.name}`;
    await c.env.BUCKET.put(bannerImageKey, await bannerImage.arrayBuffer());
  }

  await db
    .update(posts)
    .set({
      title,
      content,
      bannerImage: bannerImageKey,
      tags,
      publishedAt: new Date(publishedAt).toISOString(),
    })
    .where(sql`id = ${id}`);

  return c.redirect("/admin/blog");
});

blog.post("/delete/:id", async (c) => {
  const db = c.get("db");
  const id = parseInt(c.req.param("id"));
  const post = await db
    .select()
    .from(posts)
    .where(sql`id = ${id}`)
    .get();

  if (post) {
    await c.env.BUCKET.delete(post.bannerImage);
    await db.delete(posts).where(sql`id = ${id}`);
  }
  return c.redirect("/admin/blog");
});

blog.post("/upload", async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File;

  if (image) {
    const imageKey = `${Date.now()}-${image.name}`;
    await c.env.BUCKET.put(imageKey, await image.arrayBuffer());
    return c.json({ key: imageKey });
  }

  return c.json({ error: "No image provided" }, 400);
});

export default blog;
