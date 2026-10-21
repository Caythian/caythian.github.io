import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const categories = [
  "painting",
  "sculpture",
  "installation",
  "interdisciplinary",
  "transmedia",
  "other",
] as const;

// "ongoing" shows the year as "2025–"; "finished" shows "2025" (or "2024–2025")
const status = z.enum(["ongoing", "finished"]).default("finished");

const artworks = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/artworks" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      category: z.enum(categories),
      // Series this piece belongs to (file name in src/content/series, without .md).
      // Leave out for standalone works, which get their own row.
      series: reference("series").optional(),
      // Position within its series (1 first). Pieces without one follow, by title.
      order: z.number().optional(),
      // One-sentence description shown on the artworks list (standalone works only).
      summary: z.string().optional(),
      status,
      time: z.string().optional(),
      medium: z.string().optional(),
      dimension: z.string().optional(),
      description: z.array(z.string()).optional(),
      details: z.array(image()).optional(),
    }),
});

const series = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/series" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(categories),
    // One-sentence description shown on the artworks list.
    summary: z.string().optional(),
    status,
    // Artwork whose image is used as the series thumbnail (file name in
    // src/content/artworks, without .md). Defaults to the first piece.
    cover: reference("artworks").optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      bannerImage: image(),
      tags: z.array(z.string()).optional(),
      publishedAt: z.date(),
    }),
});

export const collections = {
  artworks,
  series,
  blog,
};
