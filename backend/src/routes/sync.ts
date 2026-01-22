import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db/index.js';

const syncRoutes = new Hono();

const changeSchema = z.object({
  action: z.enum(['create', 'update', 'delete']),
  table: z.enum(['customers', 'debts']),
  local_id: z.string(),
  data: z.record(z.unknown()).optional(),
  timestamp: z.string(),
});

// Push local changes to server
syncRoutes.post('/push', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const { changes } = z.object({
    changes: z.array(changeSchema),
  }).parse(body);

  const results: Array<{
    local_id: string;
    server_id: string;
    status: 'created' | 'updated' | 'deleted' | 'conflict';
  }> = [];

  for (const change of changes) {
    try {
      if (change.table === 'customers') {
        const result = await syncCustomer(user.id, change);
        results.push(result);
      } else if (change.table === 'debts') {
        const result = await syncDebt(user.id, change);
        results.push(result);
      }
    } catch (error) {
      console.error('Sync error:', error);
      results.push({
        local_id: change.local_id,
        server_id: '',
        status: 'conflict',
      });
    }
  }

  return c.json({ results });
});

// Pull changes from server
syncRoutes.get('/pull', async (c) => {
  const user = c.get('user');
  const since = c.req.query('since'); // ISO timestamp

  const sinceDate = since ? new Date(since) : new Date(0);

  const customers = await sql`
    SELECT id, name, phone, notes, local_id, created_at, updated_at, deleted_at
    FROM customers
    WHERE user_id = ${user.id}
      AND (updated_at > ${sinceDate} OR deleted_at > ${sinceDate})
  `;

  const debts = await sql`
    SELECT id, customer_id, amount, paid_amount, note, is_paid, paid_at, paid_via,
           local_id, created_at, updated_at, deleted_at
    FROM debts
    WHERE user_id = ${user.id}
      AND (updated_at > ${sinceDate} OR deleted_at > ${sinceDate})
  `;

  return c.json({
    customers,
    debts,
    server_time: new Date().toISOString(),
  });
});

// Sync customer
async function syncCustomer(
  userId: string,
  change: z.infer<typeof changeSchema>
): Promise<{ local_id: string; server_id: string; status: 'created' | 'updated' | 'deleted' | 'conflict' }> {
  const { action, local_id, data } = change;

  if (action === 'create') {
    // Check if already exists (by local_id)
    const existing = await sql`
      SELECT id FROM customers WHERE local_id = ${local_id} AND user_id = ${userId}
    `.then(rows => rows[0]);

    if (existing) {
      return { local_id, server_id: existing.id, status: 'conflict' };
    }

    const customer = await sql`
      INSERT INTO customers (user_id, name, phone, notes, local_id, last_synced_at)
      VALUES (${userId}, ${(data as any).name}, ${(data as any).phone || null}, ${(data as any).notes || null}, ${local_id}, NOW())
      RETURNING id
    `.then(rows => rows[0]);

    return { local_id, server_id: customer.id, status: 'created' };
  }

  if (action === 'update') {
    const customer = await sql`
      UPDATE customers
      SET
        name = ${(data as any).name},
        phone = ${(data as any).phone || null},
        notes = ${(data as any).notes || null},
        last_synced_at = NOW()
      WHERE local_id = ${local_id} AND user_id = ${userId}
      RETURNING id
    `.then(rows => rows[0]);

    return { local_id, server_id: customer?.id || '', status: customer ? 'updated' : 'conflict' };
  }

  if (action === 'delete') {
    await sql`
      UPDATE customers
      SET deleted_at = NOW(), last_synced_at = NOW()
      WHERE local_id = ${local_id} AND user_id = ${userId}
    `;

    return { local_id, server_id: '', status: 'deleted' };
  }

  return { local_id, server_id: '', status: 'conflict' };
}

// Sync debt
async function syncDebt(
  userId: string,
  change: z.infer<typeof changeSchema>
): Promise<{ local_id: string; server_id: string; status: 'created' | 'updated' | 'deleted' | 'conflict' }> {
  const { action, local_id, data } = change;

  if (action === 'create') {
    const existing = await sql`
      SELECT id FROM debts WHERE local_id = ${local_id} AND user_id = ${userId}
    `.then(rows => rows[0]);

    if (existing) {
      return { local_id, server_id: existing.id, status: 'conflict' };
    }

    // Find customer by local_id
    const customer = await sql`
      SELECT id FROM customers WHERE local_id = ${(data as any).customer_local_id} AND user_id = ${userId}
    `.then(rows => rows[0]);

    if (!customer) {
      return { local_id, server_id: '', status: 'conflict' };
    }

    const debt = await sql`
      INSERT INTO debts (user_id, customer_id, amount, note, local_id, last_synced_at)
      VALUES (${userId}, ${customer.id}, ${(data as any).amount}, ${(data as any).note || null}, ${local_id}, NOW())
      RETURNING id
    `.then(rows => rows[0]);

    return { local_id, server_id: debt.id, status: 'created' };
  }

  if (action === 'update') {
    const debt = await sql`
      UPDATE debts
      SET
        amount = COALESCE(${(data as any).amount}, amount),
        note = COALESCE(${(data as any).note}, note),
        is_paid = COALESCE(${(data as any).is_paid}, is_paid),
        paid_amount = COALESCE(${(data as any).paid_amount}, paid_amount),
        last_synced_at = NOW()
      WHERE local_id = ${local_id} AND user_id = ${userId}
      RETURNING id
    `.then(rows => rows[0]);

    return { local_id, server_id: debt?.id || '', status: debt ? 'updated' : 'conflict' };
  }

  if (action === 'delete') {
    await sql`
      UPDATE debts
      SET deleted_at = NOW(), last_synced_at = NOW()
      WHERE local_id = ${local_id} AND user_id = ${userId}
    `;

    return { local_id, server_id: '', status: 'deleted' };
  }

  return { local_id, server_id: '', status: 'conflict' };
}

export { syncRoutes };
