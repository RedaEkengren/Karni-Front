import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Star } from 'lucide-react';

const Pricing = () => {
  const { t, isArabic } = useLanguage();

  const freePlan = {
    name: { ar: 'مجاني', fr: 'Gratuit' },
    price: { ar: '0 درهم', fr: '0 DH' },
    description: { ar: 'كافي للبداية', fr: 'Suffisant pour commencer' },
    features: [
      { ar: '20 زبون', fr: '20 clients' },
      { ar: 'تسجيل الديون بلا حدود', fr: 'Enregistrement illimité des dettes' },
      { ar: 'بلا انترنت', fr: 'Fonctionne hors ligne' },
      { ar: 'Backup آمن', fr: 'Sauvegarde sécurisée' },
      { ar: 'الإحصائيات الأساسية', fr: 'Statistiques de base' },
    ],
  };

  const premiumPlan = {
    name: { ar: 'Premium', fr: 'Premium' },
    price: { ar: '40 درهم', fr: '40 DH' },
    period: { ar: '/العام', fr: '/an' },
    description: { ar: 'للمحترفين', fr: 'Pour les professionnels' },
    features: [
      { ar: 'زبائن بلا حدود', fr: 'Clients illimités' },
      { ar: 'تذكير WhatsApp', fr: 'Rappels WhatsApp' },
      { ar: 'Export PDF', fr: 'Export PDF' },
      { ar: 'قفل بالبصمة', fr: 'Verrouillage biométrique' },
      { ar: 'إحصائيات متقدمة', fr: 'Statistiques avancées' },
      { ar: 'دعم أولوية', fr: 'Support prioritaire' },
    ],
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('الأثمنة', 'Tarifs')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'ثمن عادل لتطبيق كيساعدك',
              'Un prix juste pour une app qui vous aide'
            )}
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="pricing-card">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">📦</span>
                <h2 className="text-3xl font-bold mb-2">
                  {isArabic ? freePlan.name.ar : freePlan.name.fr}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {isArabic ? freePlan.description.ar : freePlan.description.fr}
                </p>
                <div className="text-5xl font-bold text-primary">
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

              <a href="/#download" className="btn-secondary w-full text-center">
                {t('ابدأ مجانا', 'Commencer gratuitement')}
              </a>
            </div>

            {/* Premium Plan */}
            <div className="pricing-card featured">
              <div className="absolute top-4 right-4">
                <Star className="w-8 h-8 text-accent fill-accent" />
              </div>
              
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 block">⭐</span>
                <h2 className="text-3xl font-bold mb-2">
                  {isArabic ? premiumPlan.name.ar : premiumPlan.name.fr}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {isArabic ? premiumPlan.description.ar : premiumPlan.description.fr}
                </p>
                <div className="text-5xl font-bold text-accent">
                  {isArabic ? premiumPlan.price.ar : premiumPlan.price.fr}
                  <span className="text-xl font-normal text-muted-foreground">
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

              <a href="/#download" className="btn-gold w-full text-center">
                {t('جرب Premium', 'Essayer Premium')}
              </a>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-12 p-8 bg-secondary/50 rounded-2xl max-w-2xl mx-auto text-center">
            <p className="text-lg font-semibold mb-4">
              💡 {t('40 درهم فالعام =', '40 DH/an =')}
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li>• {t('أرخص من كارني ورقي (50-60 درهم)', 'Moins cher qu\'un carnet papier (50-60 DH)')}</li>
              <li>• {t('أرخص من قهوة فالأسبوع', 'Moins cher qu\'un café par semaine')}</li>
              <li>• {t('و ما غادي يتوسخ!', 'Et il ne s\'abîmera jamais!')}</li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
