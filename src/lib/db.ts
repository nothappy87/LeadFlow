import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "leadflow.db");

let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(DB_PATH);
    dbInstance.pragma("journal_mode = WAL");
    dbInstance.pragma("foreign_keys = ON");
  }
  return dbInstance;
}

export default getDb;
