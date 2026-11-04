import express from 'express';
import { answerFromKnowledgeBase } from '../services/rag.service.js';

const router = express.Router();

router.post('/message', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (message.length > 8000) return res.status(413).json({ error: 'Message is too long (8,000 character limit)' });

  try {
    const result = await answerFromKnowledgeBase(message);
    return res.json({ success: true, data: { ...result, timestamp: new Date().toISOString() } });
  } catch (error) {
    console.error('Local RAG failed:', error);
    return res.status(500).json({ error: 'Could not search the local knowledge base' });
  }
});

router.get('/status', async (_req, res) => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  const googleModels = (process.env.GOOGLE_AI_MODEL || 'gemini-3-flash-preview,gemini-3.1-flash-lite')
    .split(',')
    .map(model => model.trim())
    .filter(Boolean);
  const googleModel = googleModels[0];
  if (apiKey && apiKey !== 'your_google_ai_api_key_here') {
    res.json({ ready: true, provider: 'google-gemini', model: googleModel, models: googleModels, fallback: 'local-retrieval' });
  } else {
    const openAiKey = process.env.OPENAI_API_KEY;
    if (openAiKey && openAiKey !== 'your_openai_api_key_here') {
      return res.json({
        ready: true,
        provider: 'openai',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        models: [process.env.OPENAI_MODEL || 'gpt-4o-mini'],
        fallback: 'local-retrieval'
      });
    }
    const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(1500) });
      const result = response.ok ? await response.json() as { models?: { name: string }[] } : {};
      res.json({ ready: response.ok, provider: 'ollama', model: process.env.OLLAMA_MODEL || 'qwen2.5:3b', models: result.models?.map(model => model.name) ?? [] });
    } catch {
      res.json({ ready: false, provider: 'extractive-local', model: null, models: [] });
    }
  }
});

export default router;
