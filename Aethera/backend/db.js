const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mindspark.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      is_active INTEGER DEFAULT 0,
      activation_code TEXT,
      activation_token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Profiles table
    db.run(`CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      college TEXT,
      major TEXT,
      student_id TEXT,
      program TEXT,
      avatar TEXT,
      bio TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Usage stats table
    db.run(`CREATE TABLE IF NOT EXISTS usage_stats (
      user_id INTEGER PRIMARY KEY,
      tool_usage TEXT DEFAULT '{}',
      streak INTEGER DEFAULT 0,
      last_active_date TEXT,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0,
      badges TEXT DEFAULT '[]',
      weekly_data TEXT DEFAULT '{}',
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Saved Notes table
    db.run(`CREATE TABLE IF NOT EXISTS saved_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tool_type TEXT,
      tags TEXT DEFAULT '[]',
      is_favorite INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Chat Sessions table
    db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Chat Messages table
    db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      sender TEXT NOT NULL,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    )`);

    // Flashcards table (SuperMemo SM-2 Spaced Repetition)
    db.run(`CREATE TABLE IF NOT EXISTS flashcards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      deck_name TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      ease_factor REAL DEFAULT 2.5,
      repetition_count INTEGER DEFAULT 0,
      interval_days INTEGER DEFAULT 1,
      next_review_due DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Study Tasks table
    db.run(`CREATE TABLE IF NOT EXISTS study_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      subject TEXT,
      priority TEXT DEFAULT 'medium',
      due_date TEXT,
      status TEXT DEFAULT 'pending',
      pomodoro_target INTEGER DEFAULT 1,
      pomodoro_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Concept Mastery Matrix
    db.run(`CREATE TABLE IF NOT EXISTS concept_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      concept_name TEXT NOT NULL,
      mastery_score REAL DEFAULT 0.0,
      total_attempts INTEGER DEFAULT 0,
      correct_attempts INTEGER DEFAULT 0,
      ai_recommendation TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // API Usage Analytics
    db.run(`CREATE TABLE IF NOT EXISTS api_usage_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      tool_name TEXT NOT NULL,
      provider TEXT NOT NULL,
      model_used TEXT NOT NULL,
      prompt_tokens INTEGER DEFAULT 0,
      completion_tokens INTEGER DEFAULT 0,
      latency_ms INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    )`);

    // Subscriptions & Payment Tier Table
    db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
      user_id INTEGER PRIMARY KEY,
      plan_type TEXT DEFAULT 'free',
      status TEXT DEFAULT 'active',
      stripe_customer_id TEXT,
      current_period_end DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Security Audit Logs
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2FA TOTP Secrets Table
    db.run(`CREATE TABLE IF NOT EXISTS totp_secrets (
      user_id INTEGER PRIMARY KEY,
      secret TEXT NOT NULL,
      is_enabled INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Courses & Academic Subjects
    db.run(`CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_code TEXT,
      title TEXT NOT NULL,
      instructor_name TEXT,
      color_code TEXT DEFAULT '#a78bfa',
      semester TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Uploaded Documents & Extracted Content
    db.run(`CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      user_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_url TEXT,
      extracted_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Flashcard Decks
    db.run(`CREATE TABLE IF NOT EXISTS flashcard_decks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      cards_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Quiz Results & History
    db.run(`CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER,
      quiz_title TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      answers_json TEXT,
      time_taken_seconds INTEGER DEFAULT 0,
      taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Mind Maps Storage
    db.run(`CREATE TABLE IF NOT EXISTS mind_maps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER,
      title TEXT NOT NULL,
      tree_data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // AI Smart Study Plans
    db.run(`CREATE TABLE IF NOT EXISTS study_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER,
      target_exam_date TEXT,
      daily_target_hours REAL DEFAULT 2.0,
      plan_details_json TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Document Vector Chunks for RAG Search
    db.run(`CREATE TABLE IF NOT EXISTS document_embeddings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id INTEGER NOT NULL,
      chunk_index INTEGER NOT NULL,
      chunk_text TEXT NOT NULL,
      embedding_vector TEXT,
      page_number INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
    )`);

    // Shared Resources (Community Hub)
    db.run(`CREATE TABLE IF NOT EXISTS shared_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      resource_type TEXT NOT NULL,
      content_json TEXT NOT NULL,
      likes_count INTEGER DEFAULT 0,
      downloads_count INTEGER DEFAULT 0,
      is_public INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(author_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    // Resource Reviews & Ratings
    db.run(`CREATE TABLE IF NOT EXISTS resource_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(resource_id) REFERENCES shared_resources(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);



    // Dynamic schema migrations for existing databases
    db.all("PRAGMA table_info(users)", (err, columns) => {
      if (err) {
        console.error("Migration check failed:", err.message);
        return;
      }
      if (!columns) return;
      const hasIsActive = columns.some(c => c.name === 'is_active');
      const hasActivationCode = columns.some(c => c.name === 'activation_code');
      const hasActivationToken = columns.some(c => c.name === 'activation_token');

      db.serialize(() => {
        if (!hasIsActive) {
          db.run("ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 0", (alterErr) => {
            if (alterErr) console.error("Error adding is_active:", alterErr.message);
            else console.log("Database Migration: Added 'is_active' column to users.");
          });
        }
        if (!hasActivationCode) {
          db.run("ALTER TABLE users ADD COLUMN activation_code TEXT", (alterErr) => {
            if (alterErr) console.error("Error adding activation_code:", alterErr.message);
            else console.log("Database Migration: Added 'activation_code' column to users.");
          });
        }
        if (!hasActivationToken) {
          db.run("ALTER TABLE users ADD COLUMN activation_token TEXT", (alterErr) => {
            if (alterErr) console.error("Error adding activation_token:", alterErr.message);
            else console.log("Database Migration: Added 'activation_token' column to users.");
          });
        }
      });
    });
  });
}

module.exports = db;
