import getDb from "./db";

function migrate() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      description TEXT NOT NULL,
      score INTEGER NOT NULL CHECK(score >= 1 AND score <= 100),
      status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'saved', 'dismissed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category_id);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
  `);

  console.log("Migration complete: categories and leads tables ready.");
}

migrate();
