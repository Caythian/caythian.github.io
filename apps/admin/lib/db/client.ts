import { getDb } from "./index";

let _db: ReturnType<typeof getDb> | null = null;

export function initializeDb(database: D1Database) {
  if (!_db) {
    _db = getDb(database);
  }
  return _db;
}

export function getDbClient() {
  if (!_db) {
    throw new Error("Database not initialized. Call initializeDb first.");
  }
  return _db;
}