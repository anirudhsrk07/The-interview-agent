const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "mockify.db");
const db = new Database(DB_PATH);

// Enable Write-Ahead Logging for better concurrency
db.pragma("journal_mode = WAL");

// Initialize users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Software Engineer',
    experience TEXT DEFAULT 'Fresher',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`);

// Migrate legacy users.json data if present
const JSON_FILE = path.join(DATA_DIR, "users.json");
if (fs.existsSync(JSON_FILE)) {
  try {
    const raw = fs.readFileSync(JSON_FILE, "utf8");
    const jsonUsers = JSON.parse(raw);
    if (Array.isArray(jsonUsers) && jsonUsers.length > 0) {
      const insertStmt = db.prepare(`
        INSERT OR IGNORE INTO users (id, name, email, password_hash, role, experience, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const now = new Date().toISOString();
      for (const u of jsonUsers) {
        if (u.id && u.email && u.passwordHash) {
          insertStmt.run(
            u.id,
            u.name || "User",
            u.email.toLowerCase(),
            u.passwordHash,
            u.role || "Software Engineer",
            u.experience || "Fresher",
            u.createdAt || now,
            now
          );
        }
      }
    }
  } catch (err) {
    console.warn("Notice: Could not migrate legacy JSON users:", err.message);
  }
}

/**
 * Map SQLite DB row to user object
 */
function formatUserRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    experience: row.experience,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Find user by email
 */
function findUserByEmail(email) {
  if (!email) return null;
  const stmt = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)");
  const row = stmt.get(email.trim());
  return formatUserRow(row);
}

/**
 * Find user by ID
 */
function findUserById(id) {
  if (!id) return null;
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const row = stmt.get(id);
  return formatUserRow(row);
}

/**
 * Create/Save new user to SQLite
 */
function saveUser(user) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, experience, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    user.id,
    user.name,
    user.email.toLowerCase(),
    user.passwordHash || user.password_hash,
    user.role || "Software Engineer",
    user.experience || "Fresher",
    user.createdAt || now,
    now
  );
  return findUserById(user.id);
}

/**
 * Update user profile details in SQLite
 */
function updateUserProfile(id, data) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    UPDATE users
    SET name = COALESCE(?, name),
        role = COALESCE(?, role),
        experience = COALESCE(?, experience),
        updated_at = ?
    WHERE id = ?
  `);
  stmt.run(data.name, data.role, data.experience, now, id);
  return findUserById(id);
}

module.exports = {
  db,
  findUserByEmail,
  findUserById,
  saveUser,
  createUser: saveUser,
  updateUserProfile,
};
