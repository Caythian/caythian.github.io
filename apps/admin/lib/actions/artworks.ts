"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb, artworks, type NewArtwork } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function createArtwork(formData: FormData) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const title = formData.get("title") as string;
    const category = formData.get("category") as
      | "painting"
      | "sculpture"
      | "installation"
      | "other";
    const time = formData.get("time") as string;
    const medium = formData.get("medium") as string;
    const dimension = formData.get("dimension") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;
    const detailFiles = formData.getAll("details") as File[];

    if (!title || !category || !image || image.size === 0) {
      throw new Error("Title, category, and image are required");
    }

    // Upload main image to R2
    const imageKey = `${Date.now()}-${image.name}`;
    await env.BUCKET.put(imageKey, await image.arrayBuffer());

    // Upload detail images
    const detailKeys: string[] = [];
    for (const file of detailFiles) {
      if (file.size > 0) {
        const detailKey = `${Date.now()}-detail-${file.name}`;
        await env.BUCKET.put(detailKey, await file.arrayBuffer());
        detailKeys.push(detailKey);
      }
    }

    // Create artwork in database
    const newArtwork: NewArtwork = {
      title,
      category,
      time: time || undefined,
      medium: medium || undefined,
      dimension: dimension || undefined,
      description: description ? description.split("\n") : [],
      image: imageKey,
      details: detailKeys,
    };

    const [createdArtwork] = await db.insert(artworks).values(newArtwork).returning();

    revalidatePath("/artworks");
    return { success: true, artwork: createdArtwork };
  } catch (error) {
    console.error("Error creating artwork:", error);
    throw new Error("Failed to create artwork");
  }
}

export async function updateArtwork(id: number, formData: FormData) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const title = formData.get("title") as string;
    const category = formData.get("category") as
      | "painting"
      | "sculpture"
      | "installation"
      | "other";
    const time = formData.get("time") as string;
    const medium = formData.get("medium") as string;
    const dimension = formData.get("dimension") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;
    const detailFiles = formData.getAll("details") as File[];

    // Get existing artwork
    const existingArtwork = await db
      .select()
      .from(artworks)
      .where(sql`id = ${id}`)
      .get();

    if (!existingArtwork) {
      throw new Error("Artwork not found");
    }

    let imageKey = existingArtwork.image;

    // Update main image if provided
    if (image && image.size > 0) {
      // Delete old image
      await env.BUCKET.delete(existingArtwork.image);
      // Upload new image
      imageKey = `${Date.now()}-${image.name}`;
      await env.BUCKET.put(imageKey, await image.arrayBuffer());
    }

    // Update detail images if provided
    let detailKeys = existingArtwork.details || [];
    if (detailFiles.some((f) => f.size > 0)) {
      // Delete old detail images
      if (existingArtwork.details && existingArtwork.details.length > 0) {
        await env.BUCKET.delete(existingArtwork.details);
      }
      // Upload new detail images
      detailKeys = [];
      for (const file of detailFiles) {
        if (file.size > 0) {
          const detailKey = `${Date.now()}-detail-${file.name}`;
          await env.BUCKET.put(detailKey, await file.arrayBuffer());
          detailKeys.push(detailKey);
        }
      }
    }

    // Update artwork in database
    await db
      .update(artworks)
      .set({
        title,
        category,
        time: time || undefined,
        medium: medium || undefined,
        dimension: dimension || undefined,
        description: description ? description.split("\n") : [],
        image: imageKey,
        details: detailKeys,
      })
      .where(sql`id = ${id}`)
      .returning();

    revalidatePath("/artworks");
    return { success: true, artwork: updatedArtwork[0] };
  } catch (error) {
    console.error("Error updating artwork:", error);
    throw new Error("Failed to update artwork");
  }
}

export async function deleteArtwork(id: number) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get artwork to delete associated files
    const artwork = await db
      .select()
      .from(artworks)
      .where(sql`id = ${id}`)
      .get();

    if (!artwork) {
      throw new Error("Artwork not found");
    }

    // Delete files from R2
    const filesToDelete = [artwork.image];
    if (artwork.details && artwork.details.length > 0) {
      filesToDelete.push(...artwork.details);
    }

    await env.BUCKET.delete(filesToDelete);

    // Delete from database
    await db.delete(artworks).where(sql`id = ${id}`);

    revalidatePath("/artworks");
    return { success: true };
  } catch (error) {
    console.error("Error deleting artwork:", error);
    throw new Error("Failed to delete artwork");
  }
}

export async function getArtworks() {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const allArtworks = await db.select().from(artworks).all();
    return allArtworks;
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return [];
  }
}
