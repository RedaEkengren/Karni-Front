import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { Heart, Users, Gift, Loader2 } from 'lucide-react';

const Sadaqa = () => {
  const { t, isArabic } = useLanguage();
  const token = useAuthStore((state) => state.token);

  const [amount, setAmount] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const presetAmounts = [10, 20, 50, 100];

  const handleDonate = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    setLoading(true);

    // TODO: Call API when backend is connected
    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);
    setSuccess(true);
    setAmount('');

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🤲</span>
        </div>
        <h1 className="text-2xl font-bold">{t('صدقة', 'Sadaqa')}</h1>
        <p className="text-muted-foreground mt-2">
          {t(
            'ساعد المحتاجين بدفع ديونهم',
            'Aidez les nécessiteux en payant leurs dettes'
          )}
        </p>
      </div>

      {/* Queue Stats */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span>{t('أشخاص ينتظرون المساعدة', 'Personnes en attente')}</span>
          </div>
          <span className="font-bold text-primary">--</span>
        </div>
      </div>

      {/* Amount Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">
          {t('اختر المبلغ', 'Choisissez le montant')}
        </label>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              className={`py-3 rounded-xl border font-medium transition-colors ${
                amount === preset.toString()
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t('أو أدخل مبلغ آخر...', 'Ou entrez un autre montant...')}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background"
        />
      </div>

      {/* Anonymous Toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
        />
        <span>{t('صدقة مجهولة (لا يظهر اسمي)', 'Don anonyme (mon nom n\'apparaît pas)')}</span>
      </label>

      {/* Success Message */}
      {success && (
        <div className="bg-success/10 text-success rounded-xl p-4 flex items-center gap-3">
          <Gift className="w-5 h-5" />
          <span>{t('جزاك الله خيرا! تم إرسال صدقتك', 'Jazak Allah khairan! Votre don a été envoyé')}</span>
        </div>
      )}

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={loading || !amount || parseFloat(amount) <= 0}
        className="btn-primary w-full text-lg disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Heart className="w-5 h-5" />
            {t('تصدق', 'Faire un don')}
          </>
        )}
      </button>

      {/* Hadith */}
      <blockquote className="bg-secondary/50 rounded-xl p-4 text-center">
        <p className="text-sm">
          {t(
            '"من نفّس عن مؤمن كربة من كرب الدنيا، نفّس الله عنه كربة من كرب يوم القيامة"',
            '"Celui qui soulage un croyant d\'une difficulté, Allah le soulagera au Jour du Jugement"'
          )}
        </p>
        <cite className="text-xs text-muted-foreground mt-2 block">
          {t('— حديث شريف', '— Hadith')}
        </cite>
      </blockquote>
    </div>
  );
};

export default Sadaqa;
