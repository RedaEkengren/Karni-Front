/**
 * DeepSeek Proof-of-Concept Test
 * Run: npx tsx src/services/deepseek.test.ts
 */

import { getAIResponse, getFallbackResponse, buildSystemPrompt } from './deepseek.js';

const testContext = {
  name: 'محمد',
  language: 'ar' as const,
  is_premium: false,
  customer_count: 15,
  unpaid_debt_count: 8,
  total_unpaid: 2450,
};

const testMessages = [
  'السلام عليكم',
  'كيفاش نزيد زبون جديد؟',
  'الداطا ديالي ما كتسنكرونيزاش',
  'شنو هي الصدقة؟',
  'بغيت نولي Premium',
  'Comment ajouter un client?',
  'Mes données ne se synchronisent pas',
];

async function runTests() {
  console.log('🧪 DeepSeek Proof-of-Concept Test\n');
  console.log('━'.repeat(50));

  // Test 1: System Prompt
  console.log('\n📝 Test 1: System Prompt Generation\n');
  const prompt = buildSystemPrompt(testContext);
  console.log(prompt.substring(0, 500) + '...\n');

  // Test 2: Fallback Responses (no API key needed)
  console.log('━'.repeat(50));
  console.log('\n🔄 Test 2: Fallback Responses (offline mode)\n');

  for (const message of testMessages) {
    console.log(`User: ${message}`);
    const response = getFallbackResponse(message, testContext);
    console.log(`Bot: ${response}`);
    console.log('---');
  }

  // Test 3: Live API (if key available)
  if (process.env.DEEPSEEK_API_KEY) {
    console.log('━'.repeat(50));
    console.log('\n🌐 Test 3: Live DeepSeek API\n');

    for (const message of testMessages.slice(0, 3)) {
      console.log(`User: ${message}`);
      try {
        const response = await getAIResponse(message, testContext, []);
        console.log(`Bot: ${response}`);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
      console.log('---');
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } else {
    console.log('\n⚠️  DEEPSEEK_API_KEY not set - skipping live API test');
    console.log('   Set it in .env to test live responses');
  }

  console.log('\n✅ Tests completed!');
}

// Run tests
runTests().catch(console.error);
