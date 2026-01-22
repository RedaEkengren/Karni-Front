import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';

import { authRoutes } from './routes/auth.js';
import { customerRoutes } from './routes/customers.js';
import { debtRoutes } from './routes/debts.js';
import { sadaqaRoutes } from './routes/sadaqa.js';
import { chatRoutes } from './routes/chat.js';
import { syncRoutes } from './routes/sync.js';
import { authMiddleware } from './middleware/auth.js';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://benbodev.se', 'https://rassidi.ma'],
  credentials: true,
}));

// Health check
app.get('/', (c) => c.json({
  name: 'Rassidi API',
  version: '0.1.0',
  status: 'ok',
  message: 'رصيدك ما يضيعش'
}));

// Public routes
app.route('/auth', authRoutes);

// Protected routes
app.use('/api/*', authMiddleware);
app.route('/api/customers', customerRoutes);
app.route('/api/debts', debtRoutes);
app.route('/api/sadaqa', sadaqaRoutes);
app.route('/api/chat', chatRoutes);
app.route('/api/sync', syncRoutes);

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  }, 500);
});

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404));

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Rassidi API running on port ${port}`);
serve({ fetch: app.fetch, port });

export default app;
