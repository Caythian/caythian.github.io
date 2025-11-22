export interface Artwork {
  id: string | number;
  image: string;
  title: string;
  category: "painting" | "sculpture" | "installation" | "other";
  time?: string;
  medium?: string;
  dimension?: string;
  description?: string[];
  details?: string[];
}

export interface Post {
  id: string | number;
  title: string;
  content: string; // HTML or Markdown content
  bannerImage: string;
  tags?: string[];
  publishedAt: string | Date;
}

