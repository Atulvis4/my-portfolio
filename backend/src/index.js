import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { initDB } from './services/db.js';
import { getRedisClient } from './services/redis.js';
import rateLimiter from './middleware/rateLimiter.js';
import chatRouter from './routes/chat.js';
import systemRouter from './routes/system.js';
import contactRouter from './routes/contact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/chat', rateLimiter, chatRouter);
app.use('/api/system', systemRouter);
app.use('/api/contact', contactRouter);

// Serve frontend static files if built
const frontendDist = join(__dirname, '../../frontend/dist');
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(join(frontendDist, 'index.html')));
} else {
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
}

app.use((err, req, res, next) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await initDB();

    // Connect Redis (non-blocking — rate limiting degrades gracefully if unavailable)
    try {
      await getRedisClient().connect();
    } catch (err) {
      console.warn('[redis] Could not connect — rate limiting disabled:', err.message);
    }

    app.listen(PORT, () => {
      console.log(`[server] Running on http://localhost:${PORT}`);
      console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();
