import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(app.getPath('userData'), 'profiles.db');
const db = new Database(dbPath);

// Initialize table
db.prepare(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    proxy TEXT, -- JSON string
    fingerprint TEXT, -- JSON string
    status TEXT DEFAULT 'stopped',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export async function getProfiles() {
  const rows = db.prepare('SELECT * FROM profiles ORDER BY created_at DESC').all();
  return rows.map(row => ({
    ...row,
    proxy: JSON.parse(row.proxy),
    fingerprint: JSON.parse(row.fingerprint)
  }));
}

export async function saveProfile(profile) {
  if (!profile.id) profile.id = uuidv4();
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO profiles (id, name, proxy, fingerprint)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(
    profile.id,
    profile.name,
    JSON.stringify(profile.proxy || {}),
    JSON.stringify(profile.fingerprint || {})
  );
  
  return profile;
}

export async function deleteProfile(id) {
  db.prepare('DELETE FROM profiles WHERE id = ?').run(id);
  return true;
}
