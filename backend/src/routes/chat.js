import express from 'express';
import { embedText, chatCompletion } from '../services/gemini.js';
import { searchSimilar } from '../services/qdrant.js';
import {
  createSession,
  sessionExists,
  saveMessage,
  getRecentMessages,
} from '../services/db.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are Atul's resume assistant — a helpful, concise AI that answers questions about Atul Vishwakarma based strictly on the provided resume context.

Guidelines:
- Answer only from the context provided. Do not fabricate information.
- Be friendly, professional, and concise.
- If a question is not answerable from the resume, say so honestly.
- Refer to Atul in the third person (e.g., "Atul has worked on...").
- Keep responses under 200 words unless more detail is clearly needed.`;

router.post('/', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required and must be a string' });
    }

    const trimmedMessage = message.trim().slice(0, 500);
    if (!trimmedMessage) {
      return res.status(400).json({ error: 'message cannot be empty' });
    }

    // Resolve or create session
    let resolvedSessionId = sessionId;
    if (resolvedSessionId) {
      const valid = await sessionExists(resolvedSessionId);
      if (!valid) resolvedSessionId = null;
    }
    if (!resolvedSessionId) {
      resolvedSessionId = await createSession();
    }

    // Embed query and search Qdrant
    const queryVector = await embedText(trimmedMessage);
    const contextChunks = await searchSimilar(queryVector, 5);

    // Build context string from retrieved chunks
    const contextText = contextChunks
      .map((c) => `[${c.section}]\n${c.text}`)
      .join('\n\n');

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n--- RESUME CONTEXT ---\n${contextText}\n--- END CONTEXT ---`;

    // Fetch recent conversation history
    const history = await getRecentMessages(resolvedSessionId, 6);

    // Generate response
    const reply = await chatCompletion(fullSystemPrompt, history, trimmedMessage);

    // Persist messages
    await saveMessage(resolvedSessionId, 'user', trimmedMessage);
    await saveMessage(resolvedSessionId, 'assistant', reply);

    res.json({ reply, sessionId: resolvedSessionId });
  } catch (err) {
    console.error('[chat] Error:', err.message);

    if (err.message.includes('GEMINI_API_KEY')) {
      return res.status(503).json({ error: 'AI service not configured. Please add GEMINI_API_KEY to .env' });
    }

    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

export default router;
