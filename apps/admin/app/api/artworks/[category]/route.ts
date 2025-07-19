import { NextResponse } from "next/server";
import { getDb, artworks } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const validCategories = ["painting", "sculpture", "installation", "other"] as const;

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const { category } = params;

    if (!validCategories.includes(category as any)) {
      return NextResponse.json(
        { error: "Invalid category. Valid categories are: painting, sculpture, installation, other" },
        { status: 400 }
      );
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const categoryArtworks = await db
      .select()
      .from(artworks)
      .where(sql`category = ${category}`)
      .all();

    return NextResponse.json(categoryArtworks);
  } catch (error) {
    console.error("Error fetching artworks by category:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}