"use server"

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

export async function initializeDatabase() {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    
    // Create artworks table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS artworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT CHECK( category IN ('painting', 'sculpture', 'installation', 'other') ) NOT NULL,
        time TEXT,
        medium TEXT,
        dimension TEXT,
        description TEXT,
        details TEXT
      );
    `);

    // Create posts table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        banner_image TEXT NOT NULL,
        tags TEXT,
        published_at TEXT NOT NULL
      );
    `);

    console.log("Database tables created successfully");
    return { success: true, message: "Database initialized successfully" };
  } catch (error) {
    console.error("Error initializing database:", error);
    throw new Error("Failed to initialize database");
  }
}

export async function checkDatabaseTables() {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    
    // Check if tables exist by querying sqlite_master
    const tables = await db.all(sql`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('artworks', 'posts')
      ORDER BY name;
    `);
    
    return {
      artworksExists: tables.some((t: any) => t.name === 'artworks'),
      postsExists: tables.some((t: any) => t.name === 'posts'),
      tables: tables.map((t: any) => t.name)
    };
  } catch (error) {
    console.error("Error checking database tables:", error);
    return {
      artworksExists: false,
      postsExists: false,
      tables: [],
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}