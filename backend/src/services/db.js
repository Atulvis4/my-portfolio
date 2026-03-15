import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'portfolio',
  user: process.env.POSTGRES_USER || 'atul',
  password: process.env.POSTGRES_PASSWORD || 'portfolio123',
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
        role VARCHAR(10) CHECK (role IN ('user', 'assistant')) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session
      ON chat_messages(session_id, created_at);
    `);

    console.log('[db] Tables initialized');
  } finally {
    client.release();
  }
}

async function createSession() {
  const res = await pool.query(
    'INSERT INTO chat_sessions DEFAULT VALUES RETURNING id'
  );
  return res.rows[0].id;
}

async function sessionExists(sessionId) {
  const res = await pool.query(
    'SELECT id FROM chat_sessions WHERE id = $1',
    [sessionId]
  );
  return res.rows.length > 0;
}

async function saveMessage(sessionId, role, content) {
  await pool.query(
    'INSERT INTO chat_messages (session_id, role, content) VALUES ($1, $2, $3)',
    [sessionId, role, content]
  );
}

async function getRecentMessages(sessionId, limit = 6) {
  const res = await pool.query(
    `SELECT role, content FROM chat_messages
     WHERE session_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [sessionId, limit]
  );
  return res.rows.reverse();
}

export { initDB, createSession, sessionExists, saveMessage, getRecentMessages };
