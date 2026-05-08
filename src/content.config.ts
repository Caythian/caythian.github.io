import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const artworks = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/artworks" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      category: z.enum(["painting", "sculpture", "installation", "other"]),
      time: z.string().optional(),
      medium: z.string().optional(),
      dimension: z.string().optional(),
      description: z.array(z.string()).optional(),
      details: z.array(image()).optional(),
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
  blog,
};
