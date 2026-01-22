import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db/index.js';

const sadaqaRoutes = new Hono();

// Get sadaqa queue stats (anonymous - how many need help)
sadaqaRoutes.get('/queue', async (c) => {
  const stats = await sql`
    SELECT
      COUNT(*) as people_waiting,
      COALESCE(SUM(amount_remaining), 0) as total_amount_needed
    FROM sadaqa_queue
    WHERE is_eligible = true AND amount_remaining > 0
  `.then(rows => rows[0]);

  return c.json({
    queue: {
      people_waiting: Number(stats.people_waiting),
      total_amount_needed: Number(stats.total_amount_needed),
    },
    message: stats.people_waiting > 0
      ? `${stats.people_waiting} شخص محتاج للمساعدة`
      : 'لا يوجد أحد في قائمة الانتظار حاليا'
  });
});

// Opt-in to sadaqa queue (allow others to pay your debts)
sadaqaRoutes.post('/opt-in', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const { debt_id } = z.object({ debt_id: z.string().uuid() }).parse(body);

  // Verify debt belongs to user and is unpaid
  const debt = await sql`
    SELECT id, amount, paid_amount, is_paid
    FROM debts
    WHERE id = ${debt_id} AND user_id = ${user.id} AND deleted_at IS NULL
  `.then(rows => rows[0]);

  if (!debt) {
    return c.json({ error: 'Debt not found' }, 404);
  }

  if (debt.is_paid) {
    return c.json({ error: 'Debt already paid' }, 400);
  }

  const remaining = Number(debt.amount) - Number(debt.paid_amount);

  // Add to queue (or update if exists)
  await sql`
    INSERT INTO sadaqa_queue (debt_id, user_id, amount_remaining)
    VALUES (${debt_id}, ${user.id}, ${remaining})
    ON CONFLICT (debt_id) DO UPDATE
    SET amount_remaining = ${remaining}, is_eligible = true
  `;

  return c.json({
    success: true,
    message: 'تمت إضافة الدين لقائمة الصدقة'
  });
});

// Opt-out from sadaqa queue
sadaqaRoutes.post('/opt-out', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const { debt_id } = z.object({ debt_id: z.string().uuid() }).parse(body);

  await sql`
    UPDATE sadaqa_queue
    SET is_eligible = false
    WHERE debt_id = ${debt_id} AND user_id = ${user.id}
  `;

  return c.json({
    success: true,
    message: 'تمت إزالة الدين من قائمة الصدقة'
  });
});

// Donate sadaqa (FIFO - oldest debt first)
sadaqaRoutes.post('/donate', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const { amount, anonymous } = z.object({
    amount: z.number().positive().min(1),
    anonymous: z.boolean().default(true),
  }).parse(body);

  let remainingDonation = amount;
  const donations: Array<{ debt_id: string; amount: number; recipient_name: string }> = [];

  // Get eligible debts ordered by creation date (FIFO)
  const eligibleDebts = await sql`
    SELECT
      sq.id as queue_id,
      sq.debt_id,
      sq.user_id,
      sq.amount_remaining,
      d.amount as total_amount,
      d.paid_amount,
      c.name as customer_name,
      u.name as recipient_name,
      u.phone as recipient_phone
    FROM sadaqa_queue sq
    JOIN debts d ON d.id = sq.debt_id
    JOIN customers c ON c.id = d.customer_id
    JOIN users u ON u.id = sq.user_id
    WHERE sq.is_eligible = true
      AND sq.amount_remaining > 0
      AND sq.user_id != ${user.id}  -- Can't donate to yourself
    ORDER BY sq.created_at ASC
  `;

  for (const debt of eligibleDebts) {
    if (remainingDonation <= 0) break;

    const paymentAmount = Math.min(remainingDonation, Number(debt.amount_remaining));

    // Update debt
    const newPaidAmount = Number(debt.paid_amount) + paymentAmount;
    const fullyPaid = newPaidAmount >= Number(debt.total_amount);

    await sql`
      UPDATE debts
      SET
        paid_amount = ${newPaidAmount},
        is_paid = ${fullyPaid},
        paid_at = CASE WHEN ${fullyPaid} THEN NOW() ELSE paid_at END,
        paid_via = 'sadaqa',
        sadaqa_donor_id = CASE WHEN ${!anonymous} THEN ${user.id} ELSE NULL END
      WHERE id = ${debt.debt_id}
    `;

    // Update sadaqa queue
    const newRemaining = Number(debt.amount_remaining) - paymentAmount;
    await sql`
      UPDATE sadaqa_queue
      SET amount_remaining = ${newRemaining}
      WHERE debt_id = ${debt.debt_id}
    `;

    // Record donation
    await sql`
      INSERT INTO sadaqa_donations (donor_id, debt_id, amount, is_anonymous)
      VALUES (${user.id}, ${debt.debt_id}, ${paymentAmount}, ${anonymous})
    `;

    donations.push({
      debt_id: debt.debt_id,
      amount: paymentAmount,
      recipient_name: debt.recipient_name || 'مستفيد',
    });

    remainingDonation -= paymentAmount;

    // TODO: Send notification to recipient
    // await notifyRecipient(debt.recipient_phone, paymentAmount, anonymous);
  }

  const totalDonated = amount - remainingDonation;

  return c.json({
    success: true,
    donated: {
      total: totalDonated,
      recipients: donations.length,
      details: donations,
    },
    remaining: remainingDonation,
    message: totalDonated > 0
      ? `جزاك الله خيرا! تبرعت ب ${totalDonated} درهم لـ ${donations.length} شخص`
      : 'لا يوجد أحد في قائمة الانتظار حاليا'
  });
});

// Get my donation history
sadaqaRoutes.get('/history', async (c) => {
  const user = c.get('user');

  const donations = await sql`
    SELECT
      sd.id,
      sd.amount,
      sd.is_anonymous,
      sd.created_at,
      c.name as customer_name
    FROM sadaqa_donations sd
    JOIN debts d ON d.id = sd.debt_id
    JOIN customers c ON c.id = d.customer_id
    WHERE sd.donor_id = ${user.id}
    ORDER BY sd.created_at DESC
    LIMIT 50
  `;

  const stats = await sql`
    SELECT
      COUNT(*) as total_donations,
      COALESCE(SUM(amount), 0) as total_amount
    FROM sadaqa_donations
    WHERE donor_id = ${user.id}
  `.then(rows => rows[0]);

  return c.json({
    donations,
    stats: {
      total_donations: Number(stats.total_donations),
      total_amount: Number(stats.total_amount),
    }
  });
});

// Get received sadaqa (for recipients)
sadaqaRoutes.get('/received', async (c) => {
  const user = c.get('user');

  const received = await sql`
    SELECT
      sd.id,
      sd.amount,
      sd.is_anonymous,
      sd.created_at,
      CASE WHEN sd.is_anonymous THEN NULL ELSE u.name END as donor_name
    FROM sadaqa_donations sd
    JOIN debts d ON d.id = sd.debt_id
    LEFT JOIN users u ON u.id = sd.donor_id
    WHERE d.user_id = ${user.id}
    ORDER BY sd.created_at DESC
  `;

  const stats = await sql`
    SELECT
      COUNT(*) as times_helped,
      COALESCE(SUM(sd.amount), 0) as total_received
    FROM sadaqa_donations sd
    JOIN debts d ON d.id = sd.debt_id
    WHERE d.user_id = ${user.id}
  `.then(rows => rows[0]);

  return c.json({
    received,
    stats: {
      times_helped: Number(stats.times_helped),
      total_received: Number(stats.total_received),
    }
  });
});

export { sadaqaRoutes };
