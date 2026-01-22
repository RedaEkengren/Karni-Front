import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db/index.js';
import { getAIResponse } from '../services/deepseek.js';

const chatRoutes = new Hono();

// Send message to AI
chatRoutes.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const { message } = z.object({
    message: z.string().min(1).max(1000),
  }).parse(body);

  // Get user context for personalized responses
  const userContext = await getUserContext(user.id);

  // Get recent chat history
  const history = await sql`
    SELECT role, content
    FROM chat_messages
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 10
  `.then(rows => rows.reverse());

  // Save user message
  await sql`
    INSERT INTO chat_messages (user_id, role, content)
    VALUES (${user.id}, 'user', ${message})
  `;

  // Get AI response
  const aiResponse = await getAIResponse(message, userContext, history);

  // Save AI response
  await sql`
    INSERT INTO chat_messages (user_id, role, content)
    VALUES (${user.id}, 'assistant', ${aiResponse})
  `;

  return c.json({
    response: aiResponse,
    timestamp: new Date().toISOString(),
  });
});

// Get chat history
chatRoutes.get('/history', async (c) => {
  const user = c.get('user');
  const limit = Number(c.req.query('limit')) || 50;

  const messages = await sql`
    SELECT role, content, created_at
    FROM chat_messages
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `.then(rows => rows.reverse());

  return c.json({ messages });
});

// Clear chat history
chatRoutes.delete('/history', async (c) => {
  const user = c.get('user');

  await sql`
    DELETE FROM chat_messages
    WHERE user_id = ${user.id}
  `;

  return c.json({ success: true });
});

// Helper: Get user context for AI
async function getUserContext(userId: string) {
  const user = await sql`
    SELECT name, language, is_premium
    FROM users WHERE id = ${userId}
  `.then(rows => rows[0]);

  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM customers WHERE user_id = ${userId} AND deleted_at IS NULL) as customer_count,
      (SELECT COUNT(*) FROM debts WHERE user_id = ${userId} AND is_paid = false AND deleted_at IS NULL) as unpaid_debt_count,
      (SELECT COALESCE(SUM(amount - paid_amount), 0) FROM debts WHERE user_id = ${userId} AND is_paid = false AND deleted_at IS NULL) as total_unpaid
  `.then(rows => rows[0]);

  return {
    name: user?.name || 'المستخدم',
    language: user?.language || 'ar',
    is_premium: user?.is_premium || false,
    customer_count: Number(stats.customer_count),
    unpaid_debt_count: Number(stats.unpaid_debt_count),
    total_unpaid: Number(stats.total_unpaid),
  };
}

export { chatRoutes };
