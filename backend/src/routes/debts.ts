import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db/index.js';

const debtRoutes = new Hono();

const debtSchema = z.object({
  customer_id: z.string().uuid(),
  amount: z.number().positive(),
  note: z.string().max(500).optional(),
  local_id: z.string().optional(),
});

// List all debts
debtRoutes.get('/', async (c) => {
  const user = c.get('user');
  const { status } = c.req.query(); // 'all', 'paid', 'unpaid'

  let whereClause = sql`d.user_id = ${user.id} AND d.deleted_at IS NULL`;

  if (status === 'paid') {
    whereClause = sql`${whereClause} AND d.is_paid = true`;
  } else if (status === 'unpaid') {
    whereClause = sql`${whereClause} AND d.is_paid = false`;
  }

  const debts = await sql`
    SELECT
      d.id,
      d.customer_id,
      c.name as customer_name,
      d.amount,
      d.paid_amount,
      d.note,
      d.is_paid,
      d.paid_at,
      d.paid_via,
      d.created_at,
      d.local_id
    FROM debts d
    JOIN customers c ON c.id = d.customer_id
    WHERE ${whereClause}
    ORDER BY d.created_at DESC
  `;

  const summary = await sql`
    SELECT
      COUNT(*) FILTER (WHERE is_paid = false) as unpaid_count,
      COALESCE(SUM(CASE WHEN is_paid = false THEN amount - paid_amount ELSE 0 END), 0) as total_unpaid,
      COALESCE(SUM(CASE WHEN is_paid = true THEN amount ELSE 0 END), 0) as total_paid
    FROM debts
    WHERE user_id = ${user.id} AND deleted_at IS NULL
  `.then(rows => rows[0]);

  return c.json({ debts, summary });
});

// Create debt
debtRoutes.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const data = debtSchema.parse(body);

  // Verify customer belongs to user
  const customer = await sql`
    SELECT id FROM customers
    WHERE id = ${data.customer_id} AND user_id = ${user.id} AND deleted_at IS NULL
  `.then(rows => rows[0]);

  if (!customer) {
    return c.json({ error: 'Customer not found' }, 404);
  }

  const debt = await sql`
    INSERT INTO debts (user_id, customer_id, amount, note, local_id)
    VALUES (${user.id}, ${data.customer_id}, ${data.amount}, ${data.note || null}, ${data.local_id || null})
    RETURNING id, customer_id, amount, paid_amount, note, is_paid, created_at, local_id
  `.then(rows => rows[0]);

  return c.json({ debt }, 201);
});

// Update debt
debtRoutes.put('/:id', async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const body = await c.req.json();

  const updateSchema = z.object({
    amount: z.number().positive().optional(),
    note: z.string().max(500).optional(),
    is_paid: z.boolean().optional(),
  });

  const data = updateSchema.parse(body);

  const debt = await sql`
    UPDATE debts
    SET
      amount = COALESCE(${data.amount}, amount),
      note = COALESCE(${data.note}, note),
      is_paid = COALESCE(${data.is_paid}, is_paid),
      paid_at = CASE WHEN ${data.is_paid} = true AND is_paid = false THEN NOW() ELSE paid_at END,
      paid_via = CASE WHEN ${data.is_paid} = true AND is_paid = false THEN 'customer' ELSE paid_via END,
      paid_amount = CASE WHEN ${data.is_paid} = true THEN amount ELSE paid_amount END
    WHERE id = ${id} AND user_id = ${user.id} AND deleted_at IS NULL
    RETURNING id, customer_id, amount, paid_amount, note, is_paid, paid_at, paid_via, created_at, local_id
  `.then(rows => rows[0]);

  if (!debt) {
    return c.json({ error: 'Debt not found' }, 404);
  }

  return c.json({ debt });
});

// Partial payment
debtRoutes.post('/:id/pay', async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();
  const body = await c.req.json();

  const { amount } = z.object({ amount: z.number().positive() }).parse(body);

  const debt = await sql`
    SELECT id, amount, paid_amount, is_paid
    FROM debts
    WHERE id = ${id} AND user_id = ${user.id} AND deleted_at IS NULL
  `.then(rows => rows[0]);

  if (!debt) {
    return c.json({ error: 'Debt not found' }, 404);
  }

  if (debt.is_paid) {
    return c.json({ error: 'Debt already paid' }, 400);
  }

  const remaining = Number(debt.amount) - Number(debt.paid_amount);
  const paymentAmount = Math.min(amount, remaining);
  const newPaidAmount = Number(debt.paid_amount) + paymentAmount;
  const fullyPaid = newPaidAmount >= Number(debt.amount);

  const updated = await sql`
    UPDATE debts
    SET
      paid_amount = ${newPaidAmount},
      is_paid = ${fullyPaid},
      paid_at = CASE WHEN ${fullyPaid} THEN NOW() ELSE paid_at END,
      paid_via = 'partial'
    WHERE id = ${id}
    RETURNING id, amount, paid_amount, is_paid, paid_at, paid_via
  `.then(rows => rows[0]);

  return c.json({
    debt: updated,
    payment: {
      amount: paymentAmount,
      remaining: Number(updated.amount) - Number(updated.paid_amount),
    },
  });
});

// Delete debt (soft delete)
debtRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const { id } = c.req.param();

  const result = await sql`
    UPDATE debts
    SET deleted_at = NOW()
    WHERE id = ${id} AND user_id = ${user.id} AND deleted_at IS NULL
    RETURNING id
  `;

  if (result.length === 0) {
    return c.json({ error: 'Debt not found' }, 404);
  }

  return c.json({ success: true });
});

export { debtRoutes };
