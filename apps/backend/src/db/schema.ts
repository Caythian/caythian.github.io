import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Define the artworks table
export const artworks = sqliteTable("artworks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  image: text("image").notNull(),
  title: text("title").notNull(),
  time: text("time"),
  medium: text("medium"),
  dimension: text("dimension"),
  description: text("description", { mode: "json" }).$type<string[]>(),
  details: text("details", { mode: "json" }).$type<string[]>(),
});

