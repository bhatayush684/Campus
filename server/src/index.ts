import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import scraperRoutes from './routes/scraper.js';
import dataRoutes from './routes/data.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(serverDirectory, '../../dist');

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const configuredOrigins = (process.env.CORS_ORIGIN || '')
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
    const localOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
    if (!origin || configuredOrigins.length === 0 || configuredOrigins.includes(origin) || localOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }
  return next(err);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusMind API is running' });
});

// Routes
app.use('/api/scraper', scraperRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/chat', chatRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDirectory));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
      return res.sendFile(path.join(frontendDirectory, 'index.html'));
    }
    return next();
  });
}

// Error handling
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err instanceof Error ? err.message : 'Unexpected server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CampusMind API server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});
