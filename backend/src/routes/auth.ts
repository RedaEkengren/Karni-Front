import { Hono } from 'hono';
import { z } from 'zod';
import { sql } from '../db/index.js';
import { generateToken } from '../middleware/auth.js';
import { sendWhatsAppOTP } from '../services/whatsapp.js';
import { createClient } from 'redis';

const authRoutes = new Hono();

// Redis for OTP storage
const redis = createClient({ url: process.env.REDIS_URL });
redis.connect().catch(console.error);

const phoneSchema = z.object({
  phone: z.string().min(10).max(15).regex(/^\+?[0-9]+$/),
});

const verifySchema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

// Request OTP
authRoutes.post('/request-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { phone } = phoneSchema.parse(body);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 5-minute expiry
    await redis.setEx(`otp:${phone}`, 300, otp);

    // Send via WhatsApp
    const sent = await sendWhatsAppOTP(phone, otp);

    if (!sent) {
      // Fallback: log OTP in dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 OTP for ${phone}: ${otp}`);
      }
    }

    return c.json({
      success: true,
      message: 'OTP sent via WhatsApp',
      // Only in dev mode
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid phone number' }, 400);
    }
    throw error;
  }
});

// Verify OTP
authRoutes.post('/verify-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { phone, code } = verifySchema.parse(body);

    // Get OTP from Redis
    const storedOTP = await redis.get(`otp:${phone}`);

    if (!storedOTP) {
      return c.json({ error: 'OTP expired or not found' }, 400);
    }

    if (storedOTP !== code) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // Delete used OTP
    await redis.del(`otp:${phone}`);

    // Find or create user
    let user = await sql`
      SELECT id, phone, name, language, is_premium, premium_until
      FROM users WHERE phone = ${phone}
    `.then(rows => rows[0]);

    if (!user) {
      // Create new user
      user = await sql`
        INSERT INTO users (phone)
        VALUES (${phone})
        RETURNING id, phone, name, language, is_premium, premium_until
      `.then(rows => rows[0]);
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      phone: user.phone,
      is_premium: user.is_premium,
    });

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        language: user.language,
        is_premium: user.is_premium,
        premium_until: user.premium_until,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request data' }, 400);
    }
    throw error;
  }
});

// Update profile
authRoutes.put('/profile', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();

  const updateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    language: z.enum(['ar', 'fr']).optional(),
  });

  const data = updateSchema.parse(body);

  const updated = await sql`
    UPDATE users
    SET
      name = COALESCE(${data.name}, name),
      language = COALESCE(${data.language}, language)
    WHERE id = ${user.id}
    RETURNING id, phone, name, language, is_premium
  `.then(rows => rows[0]);

  return c.json({ user: updated });
});

export { authRoutes };
