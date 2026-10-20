export type ArtworkCategory =
  | "painting"
  | "sculpture"
  | "installation"
  | "interdisciplinary"
  | "other";

// A single artwork as shown in the series popup
export interface Artwork {
  id: string;
  slug: string;
  image: string;
  title: string;
  time?: string;
  medium?: string;
  dimension?: string;
  description?: string[];
  hasDetails: boolean;
}

// One row on the artworks page: a series, or a standalone work
export interface ArtworkRow {
  id: string;
  title: string;
  category: ArtworkCategory;
  years?: string;
  summary?: string;
  cover: string;
  pieces: Artwork[];
}

export interface Post {
  id: string | number;
  title: string;
  content: string; // HTML or Markdown content
  bannerImage: string;
  tags?: string[];
  publishedAt: string | Date;
}
