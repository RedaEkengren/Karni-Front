/**
 * WhatsApp Service for Rassidi
 * رصيدي - OTP & Reminders via WhatsApp
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send OTP via WhatsApp
 */
export async function sendWhatsAppOTP(phone: string, otp: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('Twilio not configured, skipping WhatsApp OTP');
    return false;
  }

  const message = `🔐 رصيدي - Rassidi

رمز التحقق ديالك: *${otp}*
Votre code de vérification: *${otp}*

صالح لمدة 5 دقائق / Valide 5 minutes`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Send debt reminder to customer
 */
export async function sendDebtReminder(
  phone: string,
  customerName: string,
  amount: number,
  merchantName: string,
  language: 'ar' | 'fr' = 'ar'
): Promise<boolean> {
  const messageAr = `السلام عليكم ${customerName} 🙏

هاد رسالة تذكيرية من ${merchantName}.

عندك دين بقيمة: *${amount} درهم*

الله يسهل عليك الخلاص 🤲

- رصيدي`;

  const messageFr = `Bonjour ${customerName} 🙏

Ceci est un rappel de ${merchantName}.

Vous avez une dette de: *${amount} MAD*

Merci de régulariser quand possible 🤲

- Rassidi`;

  const message = language === 'ar' ? messageAr : messageFr;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Send sadaqa notification to recipient
 */
export async function sendSadaqaNotification(
  phone: string,
  amount: number,
  anonymous: boolean,
  donorName?: string
): Promise<boolean> {
  const donorText = anonymous ? 'شخص محسن / un bienfaiteur anonyme' : donorName;

  const message = `🤲 بشرى سارة! / Bonne nouvelle!

${donorText} دفع ${amount} درهم من ديونك كصدقة.
${donorText} a payé ${amount} MAD de vos dettes en sadaqa.

جزاه الله خيرا 💚
Que Dieu le récompense 💚

- رصيدي Rassidi`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * Core function to send WhatsApp message via Twilio
 */
async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('Twilio not configured');
    return false;
  }

  // Format phone number
  const formattedPhone = formatPhoneNumber(to);
  if (!formattedPhone) {
    console.error('Invalid phone number:', to);
    return false;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

  const params = new URLSearchParams({
    To: `whatsapp:${formattedPhone}`,
    From: TWILIO_WHATSAPP_FROM,
    Body: body,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio error:', error);
      return false;
    }

    const data = await response.json();
    console.log('WhatsApp message sent:', data.sid);
    return true;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return false;
  }
}

/**
 * Format phone number to international format
 */
function formatPhoneNumber(phone: string): string | null {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Handle Moroccan numbers
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    // 06XXXXXXXX → +212 6XXXXXXXX
    cleaned = '212' + cleaned.substring(1);
  }

  // Add + if not present
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  // Validate length (minimum 10 digits)
  if (cleaned.length < 11) {
    return null;
  }

  return cleaned;
}

export { sendWhatsAppMessage, formatPhoneNumber };
