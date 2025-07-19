"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, posts, type NewPost } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function createPost(formData: FormData) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;
    const publishedAt = formData.get("publishedAt") as string;
    const bannerImage = formData.get("bannerImage") as File;
    
    if (!title || !content || !bannerImage || bannerImage.size === 0) {
      throw new Error("Title, content, and banner image are required");
    }
    
    // Upload banner image to R2
    const bannerImageKey = `${Date.now()}-banner-${bannerImage.name}`;
    await env.BUCKET.put(bannerImageKey, await bannerImage.arrayBuffer());
    
    // Create post in database
    const newPost: NewPost = {
      title,
      content,
      bannerImage: bannerImageKey,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(t => t) : [],
      publishedAt: new Date(publishedAt).toISOString(),
    };
    
    const [createdPost] = await db.insert(posts).values(newPost).returning();
    
    revalidatePath("/blog");
    return { success: true, post: createdPost };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
}

export async function updatePost(id: number, formData: FormData) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;
    const publishedAt = formData.get("publishedAt") as string;
    const bannerImage = formData.get("bannerImage") as File;
    
    // Get existing post
    const existingPost = await db
      .select()
      .from(posts)
      .where(sql`id = ${id}`)
      .get();
    
    if (!existingPost) {
      throw new Error("Post not found");
    }
    
    let bannerImageKey = existingPost.bannerImage;
    
    // Update banner image if provided
    if (bannerImage && bannerImage.size > 0) {
      // Delete old image
      await env.BUCKET.delete(existingPost.bannerImage);
      // Upload new image
      bannerImageKey = `${Date.now()}-banner-${bannerImage.name}`;
      await env.BUCKET.put(bannerImageKey, await bannerImage.arrayBuffer());
    }
    
    // Update post in database
    const [updatedPost] = await db
      .update(posts)
      .set({
        title,
        content,
        bannerImage: bannerImageKey,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(t => t) : [],
        publishedAt: new Date(publishedAt).toISOString(),
      })
      .where(sql`id = ${id}`)
      .returning();
    
    revalidatePath("/blog");
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post");
  }
}

export async function deletePost(id: number) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    
    // Get post to delete associated files
    const post = await db
      .select()
      .from(posts)
      .where(sql`id = ${id}`)
      .get();
    
    if (!post) {
      throw new Error("Post not found");
    }
    
    // Delete banner image from R2
    await env.BUCKET.delete(post.bannerImage);
    
    // Delete from database
    await db.delete(posts).where(sql`id = ${id}`);
    
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}

export async function getPosts() {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    
    const allPosts = await db.select().from(posts).all();
    return allPosts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const { env } = getCloudflareContext();
    const image = formData.get("image") as File;
    
    if (!image || image.size === 0) {
      throw new Error("No image provided");
    }
    
    const imageKey = `${Date.now()}-${image.name}`;
    await env.BUCKET.put(imageKey, await image.arrayBuffer());
    
    return { key: imageKey };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}