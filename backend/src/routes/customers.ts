import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db/index.js';

const customerRoutes = new Hono();

const customerSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
  local_id: z.string().optional(), // For offline sync
});

// List customers
customerRoutes.get('/', async (c) => {
  const user = c.get('user');

  const customers = await sql`
    SELECT
      c.id,
      c.name,
      c.phone,
      c.notes,
      c.created_at,
      c.local_id,
      COALESCE(SUM(CASE WHEN d.is_paid = false THEN d.amount - d.paid_amount ELSE 0 END), 0) as total_debt,
      COUNT(d.id) FILTER (WHERE d.is_paid = false) as unpaid_count,
      MAX(d.created_at) as last_debt_date
    FROM customers c
    LEFT JOIN debts d ON d.customer_id = c.id AND d.deleted_at IS NULL
    WHERE c.user_id = ${user.id} AND c.deleted_at IS NULL
    GROUP BY c.id
    ORDER BY c.name ASC
  `;

  return c.json({ customers });
});

// Get single customer with debts
customerRoutes.get('/:id', async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const customer = await sql`
    SELECT id, name, phone, notes, created_at, local_id
    FROM customers
    WHERE id = ${id} AND user_id = ${user.id} AND deleted_at IS NULL
  `.then(rows => rows[0]);

  if (!customer) {
    return c.json({ error: 'Customer not found' }, 404);
  }

  const debts = await sql`
    SELECT id, amount, paid_amount, note, is_paid, paid_at, paid_via, created_at, local_id
    FROM debts
    WHERE customer_id = ${id} AND deleted_at IS NULL
    ORDER BY created_at DESC
  `;

  const total_debt = debts
    .filter(d => !d.is_paid)
    .reduce((sum, d) => sum + Number(d.amount) - Number(d.paid_amount), 0);

  return c.json({ customer: { ...customer, total_debt, debts } });
});

// Create customer
customerRoutes.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const data = customerSchema.parse(body);

  // Check customer limit for free users
  if (!user.is_premium) {
    const count = await sql`
      SELECT COUNT(*) as count FROM customers
      WHERE user_id = ${user.id} AND deleted_at IS NULL
    `.then(rows => Number(rows[0].count));

    if (count >= 20) {
      return c.json({
        error: 'Customer limit reached',
        message: 'Free plan allows 20 customers. Upgrade to Premium for unlimited.',
        code: 'LIMIT_REACHED'
      }, 403);
    }
  }

  const customer = await sql`
    INSERT INTO customers (user_id, name, phone, notes, local_id)
    VALUES (${user.id}, ${data.name}, ${data.phone || null}, ${data.notes || null}, ${data.local_id || null})
    RETURNING id, name, phone, notes, created_at, local_id
  `.then(rows => rows[0]);

  return c.json({ customer }, 201);
});

// Update customer
customerRoutes.put('/:id', async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const body = await c.req.json();

  const data = customerSchema.partial().parse(body);

  const customer = await sql`
    UPDATE customers
    SET
      name = COALESCE(${data.name}, name),
      phone = COALESCE(${data.phone}, phone),
      notes = COALESCE(${data.notes}, notes)
    WHERE id = ${id} AND user_id = ${user.id} AND deleted_at IS NULL
    RETURNING id, name, phone, notes, created_at, local_id
  `.then(rows => rows[0]);

  if (!customer) {
    return c.json({ error: 'Customer not found' }, 404);
  }

  return c.json({ customer });
});

// Delete customer (soft delete)
customerRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const result = await sql`
    UPDATE customers
    SET deleted_at = NOW()
    WHERE id = ${id} AND user_id = ${user.id} AND deleted_at IS NULL
    RETURNING id
  `;

  if (result.length === 0) {
    return c.json({ error: 'Customer not found' }, 404);
  }

  // Also soft delete all debts
  await sql`
    UPDATE debts
    SET deleted_at = NOW()
    WHERE customer_id = ${id}
  `;

  return c.json({ success: true });
});

export { customerRoutes };
