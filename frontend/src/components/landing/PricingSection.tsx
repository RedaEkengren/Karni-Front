import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Star } from 'lucide-react';

const PricingSection = () => {
  const { t, isArabic } = useLanguage();

  const freePlan = {
    name: { ar: 'مجاني', fr: 'Gratuit' },
    price: { ar: '0 درهم', fr: '0 DH' },
    features: [
      { ar: '20 زبون', fr: '20 clients' },
      { ar: 'تسجيل الديون', fr: 'Enregistrement des dettes' },
      { ar: 'بلا انترنت', fr: 'Fonctionne hors ligne' },
      { ar: 'Backup آمن', fr: 'Sauvegarde sécurisée' },
    ],
  };

  const premiumPlan = {
    name: { ar: 'Premium', fr: 'Premium' },
    price: { ar: '40 درهم', fr: '40 DH' },
    period: { ar: '/العام', fr: '/an' },
    features: [
      { ar: 'زبائن بلا حدود', fr: 'Clients illimités' },
      { ar: 'تذكير WhatsApp', fr: 'Rappels WhatsApp' },
      { ar: 'Export PDF', fr: 'Export PDF' },
      { ar: 'قفل بالبصمة', fr: 'Verrouillage biométrique' },
    ],
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-secondary/30">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('الثمن', 'Tarifs')}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          {t(
            'ابدأ مجانا، و طور ملي تحتاج',
            'Commencez gratuitement, évoluez quand vous en avez besoin'
          )}
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="pricing-card">
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">📦</span>
              <h3 className="text-2xl font-bold mb-2">
                {isArabic ? freePlan.name.ar : freePlan.name.fr}
              </h3>
              <div className="text-4xl font-bold text-primary">
                {isArabic ? freePlan.price.ar : freePlan.price.fr}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {freePlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{isArabic ? feature.ar : feature.fr}</span>
                </li>
              ))}
            </ul>

            <a href="#download" className="btn-secondary w-full">
              {t('ابدأ مجانا', 'Commencer gratuitement')}
            </a>
          </div>

          {/* Premium Plan */}
          <div className="pricing-card featured">
            <div className="absolute top-4 right-4">
              <Star className="w-6 h-6 text-accent fill-accent" />
            </div>
            
            <div className="text-center mb-6">
              <span className="text-4xl mb-2 block">⭐</span>
              <h3 className="text-2xl font-bold mb-2">
                {isArabic ? premiumPlan.name.ar : premiumPlan.name.fr}
              </h3>
              <div className="text-4xl font-bold text-accent">
                {isArabic ? premiumPlan.price.ar : premiumPlan.price.fr}
                <span className="text-lg font-normal text-muted-foreground">
                  {isArabic ? premiumPlan.period.ar : premiumPlan.period.fr}
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {premiumPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{isArabic ? feature.ar : feature.fr}</span>
                </li>
              ))}
            </ul>

            <a href="#download" className="btn-gold w-full">
              {t('جرب Premium', 'Essayer Premium')}
            </a>
          </div>
        </div>

        {/* Value proposition */}
        <p className="text-center text-muted-foreground mt-8 text-sm">
          💡 {t(
            '40 درهم فالعام = أرخص من كارني ورقي جديد',
            '40 DH/an = moins cher qu\'un nouveau carnet papier'
          )}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
