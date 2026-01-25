import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight, Check, Shield, MessageCircle, Cloud, Fingerprint } from 'lucide-react';
import { useState } from 'react';

const HeroSection = () => {
  const { t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend waitlist API
    console.log('Waitlist signup:', email);
    setSubmitted(true);
  };

  const benefits = [
    { ar: 'ما عمرك تخسر فلوسك', fr: 'Jamais de données perdues', icon: Cloud },
    { ar: 'دعم 24/7 بالدارجة', fr: 'Support 24/7 en darija', icon: MessageCircle },
    { ar: 'صدقة - ساعد الآخرين', fr: 'Sadaqa - Aidez les autres', icon: '🤲' },
    { ar: 'قفل بالبصمة', fr: 'Verrouillage biométrique', icon: Fingerprint },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* App Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-primary rounded-3xl mb-6 md:mb-8 shadow-lg animate-float">
            <span className="text-4xl md:text-5xl">📓</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-slide-up">
            {t('سمارت كارني', 'Smart Karni')}
          </h1>

          {/* NEW Tagline - Focus on never losing data */}
          <p className="text-xl md:text-2xl text-primary font-semibold mb-6 animate-slide-up delay-100">
            {t('ما عمرك تخسر فلوسك - أبدا!', 'Ne perdez plus jamais vos données - Jamais!')}
          </p>

          {/* Description - Emphasize reliability vs competitor */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up delay-200">
            {t(
              'التطبيق المغربي الوحيد لتتبع الديون مع backup تلقائي، دعم 24/7 بالدارجة، و صدقة لمساعدة المحتاجين',
              'La seule app marocaine de suivi des dettes avec sauvegarde automatique, support 24/7 en darija, et Sadaqa pour aider les nécessiteux'
            )}
          </p>

          {/* Waitlist Form */}
          <div className="animate-slide-up delay-300 mb-8">
            {!submitted ? (
              <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isArabic ? 'الإيميل ديالك...' : 'Votre email...'}
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button type="submit" className="btn-primary text-lg whitespace-nowrap">
                  {t('سجل فالقائمة', 'Rejoindre la liste')}
                  <Arrow className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="bg-success/10 text-success px-6 py-4 rounded-xl inline-flex items-center gap-2">
                <Check className="w-6 h-6" />
                <span className="font-semibold">
                  {t('شكرا! غادي نخبروك ملي نلانسيو', 'Merci! On vous préviendra au lancement')}
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-3">
              {t('🚀 قريبا جدا - كون من الأوائل!', '🚀 Bientôt disponible - Soyez parmi les premiers!')}
            </p>
          </div>

          {/* Benefits - NEW with icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up delay-400">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50"
              >
                {typeof benefit.icon === 'string' ? (
                  <span className="text-2xl">{benefit.icon}</span>
                ) : (
                  <benefit.icon className="w-6 h-6 text-primary" />
                )}
                <span className="font-medium text-sm text-center">
                  {isArabic ? benefit.ar : benefit.fr}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
