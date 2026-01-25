import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight, Check, Bell } from 'lucide-react';
import { useState } from 'react';

const CTASection = () => {
  const { t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend waitlist API
    console.log('Waitlist signup:', phone);
    setSubmitted(true);
  };

  return (
    <section id="download" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="section-container text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
          <Bell className="w-8 h-8 text-accent-foreground" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('كن من الأوائل!', 'Soyez parmi les premiers!')}
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
          {t(
            'سجل دابا باش نخبروك ملي نلانسيو سمارت كارني. الأوائل غادي يستافدو من Premium مجانا لمدة شهر!',
            'Inscrivez-vous maintenant pour être notifié au lancement. Les premiers inscrits auront Premium gratuit pendant un mois!'
          )}
        </p>

        {/* Waitlist Form */}
        {!submitted ? (
          <form onSubmit={handleWaitlist} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isArabic ? 'رقم الهاتف (06...)' : 'Numéro de téléphone (06...)'}
                className="flex-1 px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <button type="submit" className="btn-gold text-lg whitespace-nowrap">
                {t('خبرني', 'Me notifier')}
                <Arrow className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-primary-foreground/60 mt-3">
              {t('غادي نرسلولك WhatsApp ملي نلانسيو', 'On vous enverra un WhatsApp au lancement')}
            </p>
          </form>
        ) : (
          <div className="bg-accent/20 text-primary-foreground px-6 py-4 rounded-xl inline-flex items-center gap-2 mb-8">
            <Check className="w-6 h-6" />
            <span className="font-semibold">
              {t('تم! غادي نخبروك قريبا إن شاء الله', 'C\'est fait! On vous contactera bientôt inchallah')}
            </span>
          </div>
        )}

        {/* Coming soon badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-primary-foreground/10 rounded-xl px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">▶️</span>
            <div className="text-start">
              <div className="text-xs text-primary-foreground/60">
                {t('قريبا على', 'Bientôt sur')}
              </div>
              <div className="font-semibold">Google Play</div>
            </div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">🍎</span>
            <div className="text-start">
              <div className="text-xs text-primary-foreground/60">
                {t('قريبا على', 'Bientôt sur')}
              </div>
              <div className="font-semibold">App Store</div>
            </div>
          </div>
          <div className="bg-primary-foreground/10 rounded-xl px-6 py-3 flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div className="text-start">
              <div className="text-xs text-primary-foreground/60">
                {t('قريبا على', 'Bientôt sur')}
              </div>
              <div className="font-semibold">Web App</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
