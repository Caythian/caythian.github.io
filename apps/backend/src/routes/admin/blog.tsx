import { Hono } from "hono";
import { jsx } from "hono/jsx";
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
            <form action="/admin/blog/create" method="post" class="space-y-4">
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
                        >
                        </div>
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
  
              const toolbarOptions = {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['link', 'image', 'video'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
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
    const tags = (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const publishedAt = formData.get("publishedAt") as string;
  
    if (title && content) {
      await db.insert(posts).values({
        title,
        content,
        tags,
        publishedAt: new Date(publishedAt).toISOString(),
      });
    }
  
    return c.redirect("/admin/blog");
  });
  
  blog.post("/edit/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    const formData = await c.req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const publishedAt = formData.get("publishedAt") as string;
  
    await db
      .update(posts)
      .set({
        title,
        content,
        tags,
        publishedAt: new Date(publishedAt).toISOString(),
      })
      .where(sql`id = ${id}`);
  
    return c.redirect("/admin/blog");
  });
  
  blog.post("/delete/:id", async (c) => {
    const db = c.get("db");
    const id = parseInt(c.req.param("id"));
    await db.delete(posts).where(sql`id = ${id}`);
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