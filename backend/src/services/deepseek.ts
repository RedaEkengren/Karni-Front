/**
 * DeepSeek AI Service for Rassidi
 * رصيدي - 24/7 AI Support in Darija & French
 */

interface UserContext {
  name: string;
  language: 'ar' | 'fr';
  is_premium: boolean;
  customer_count: number;
  unpaid_debt_count: number;
  total_unpaid: number;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function buildSystemPrompt(context: UserContext): string {
  const arabicPrompt = `أنت مساعد رصيدي، التطبيق المغربي لتسجيل وتتبع الديون.

معلومات المستخدم:
- الاسم: ${context.name}
- عدد الزبائن: ${context.customer_count}
- عدد الديون غير المدفوعة: ${context.unpaid_debt_count}
- إجمالي الديون: ${context.total_unpaid} درهم
- الاشتراك: ${context.is_premium ? 'Premium' : 'مجاني'}

قواعد مهمة:
1. تحدث بالدارجة المغربية أو الفرنسية حسب لغة المستخدم
2. كن ودودا وصبورا واستخدم كلمات بسيطة
3. ساعد في: إضافة زبائن، تسجيل ديون، الصدقة، مشاكل المزامنة
4. إذا لم تعرف الجواب قل: "غادي نوصل سؤالك للفريق"
5. لا تعطي نصائح مالية أو قروض أبدا
6. كن مختصرا - جملتين أو ثلاث كافية

أمثلة للأسئلة الشائعة:
- "كيفاش نزيد زبون؟" → اشرح خطوات إضافة زبون
- "الداطا ما كتسنكرونيزاش" → اطلب منه التحقق من الاتصال وإعادة المحاولة
- "شنو الصدقة؟" → اشرح أن الصدقة تتيح للآخرين دفع ديون المحتاجين`;

  const frenchPrompt = `Tu es l'assistant Rassidi, l'application marocaine de suivi des dettes.

Informations utilisateur:
- Nom: ${context.name}
- Nombre de clients: ${context.customer_count}
- Dettes impayées: ${context.unpaid_debt_count}
- Total dû: ${context.total_unpaid} MAD
- Abonnement: ${context.is_premium ? 'Premium' : 'Gratuit'}

Règles importantes:
1. Réponds en darija marocaine ou français selon la langue de l'utilisateur
2. Sois amical, patient et utilise des mots simples
3. Aide avec: ajouter clients, enregistrer dettes, sadaqa, problèmes de sync
4. Si tu ne sais pas: "Je vais transférer ta question à l'équipe"
5. JAMAIS de conseils financiers ou de prêts
6. Sois concis - 2-3 phrases suffisent

Exemples de questions fréquentes:
- "Comment ajouter un client?" → Explique les étapes
- "Mes données ne se synchronisent pas" → Demande de vérifier la connexion
- "C'est quoi la sadaqa?" → Explique que d'autres peuvent payer les dettes des nécessiteux`;

  return context.language === 'ar' ? arabicPrompt : frenchPrompt;
}

export async function getAIResponse(
  userMessage: string,
  context: UserContext,
  history: ChatMessage[] = []
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.warn('DeepSeek API key not configured, using fallback response');
    return getFallbackResponse(userMessage, context);
  }

  const systemPrompt = buildSystemPrompt(context);

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10), // Last 10 messages for context
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('DeepSeek API error:', error);
      return getFallbackResponse(userMessage, context);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || getFallbackResponse(userMessage, context);
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return getFallbackResponse(userMessage, context);
  }
}

// Fallback responses when API is unavailable
function getFallbackResponse(message: string, context: UserContext): string {
  const lowerMessage = message.toLowerCase();

  // Common patterns in Darija/French
  const patterns = {
    greeting: /^(salam|salut|bonjour|hi|hello|مرحبا|السلام)/i,
    addCustomer: /(زيد|ajouter|add).*(زبون|client|customer)/i,
    addDebt: /(زيد|سجل|ajouter|add).*(دين|dette|debt)/i,
    sync: /(sync|مزامنة|synchron)/i,
    sadaqa: /(صدقة|sadaqa|sadaka)/i,
    help: /(مساعدة|aide|help|كيفاش|comment)/i,
    premium: /(premium|بريميوم|اشتراك|abonnement)/i,
  };

  if (patterns.greeting.test(lowerMessage)) {
    return context.language === 'ar'
      ? `مرحبا ${context.name}! كيف نقدر نعاونك اليوم؟`
      : `Bonjour ${context.name}! Comment puis-je vous aider?`;
  }

  if (patterns.addCustomer.test(lowerMessage)) {
    return context.language === 'ar'
      ? 'باش تزيد زبون: اضغط على "+" فالصفحة الرئيسية، دخل الاسم (الهاتف اختياري)، واضغط "حفظ".'
      : 'Pour ajouter un client: appuyez sur "+" sur la page d\'accueil, entrez le nom (téléphone optionnel), et appuyez "Enregistrer".';
  }

  if (patterns.addDebt.test(lowerMessage)) {
    return context.language === 'ar'
      ? 'باش تسجل دين: اختار الزبون، اضغط "زيد دين"، دخل المبلغ والملاحظة إلا بغيتي، واضغط "حفظ".'
      : 'Pour ajouter une dette: choisissez le client, appuyez "Ajouter dette", entrez le montant et une note si vous voulez, puis "Enregistrer".';
  }

  if (patterns.sync.test(lowerMessage)) {
    return context.language === 'ar'
      ? 'إلا الداطا ما كتسنكرونيزاش: 1) تأكد من الاتصال بالإنترنت 2) أغلق التطبيق وفتحو من جديد 3) إلا ما خدمش، راسلنا.'
      : 'Si les données ne se synchronisent pas: 1) Vérifiez votre connexion 2) Fermez et rouvrez l\'app 3) Si ça persiste, contactez-nous.';
  }

  if (patterns.sadaqa.test(lowerMessage)) {
    return context.language === 'ar'
      ? 'الصدقة فرصيدي: تقدر تساعد ناس آخرين بدفع ديونهم. اضغط على "صدقة"، اختار المبلغ، والتطبيق غادي يدفع للأقدم أولا. الله يجازيك خير!'
      : 'Sadaqa dans Rassidi: vous pouvez aider d\'autres en payant leurs dettes. Appuyez sur "Sadaqa", choisissez le montant, l\'app paiera les plus anciennes dettes d\'abord. Que Dieu vous récompense!';
  }

  if (patterns.premium.test(lowerMessage)) {
    return context.language === 'ar'
      ? 'Premium ب 40 درهم/العام فقط! تحصل على: زبائن بلا حدود، تذكير WhatsApp، PDF، قفل بالبصمة، ودعم أولوية.'
      : 'Premium à seulement 40 MAD/an! Vous obtenez: clients illimités, rappels WhatsApp, PDF, verrouillage biométrique, et support prioritaire.';
  }

  // Default response
  return context.language === 'ar'
    ? 'شكرا على سؤالك! غادي نوصلو للفريق باش يعاونوك. تقدر تراسلنا على WhatsApp إلا كان مستعجل.'
    : 'Merci pour votre question! Je vais la transmettre à l\'équipe. Vous pouvez nous contacter sur WhatsApp si c\'est urgent.';
}

// Export for testing
export { buildSystemPrompt, getFallbackResponse };
