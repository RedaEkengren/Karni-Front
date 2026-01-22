import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorksSection = () => {
  const { t, isArabic } = useLanguage();

  const steps = [
    {
      number: '1',
      icon: '📲',
      title: { ar: 'نزّل التطبيق', fr: 'Téléchargez l\'app' },
      description: {
        ar: 'من Google Play، مجانا',
        fr: 'Depuis Google Play, gratuitement'
      },
    },
    {
      number: '2',
      icon: '👤',
      title: { ar: 'زيد الزبون', fr: 'Ajoutez le client' },
      description: {
        ar: 'غير الإسم كافي',
        fr: 'Juste le nom suffit'
      },
    },
    {
      number: '3',
      icon: '✍️',
      title: { ar: 'سجّل الدين', fr: 'Enregistrez la dette' },
      description: {
        ar: 'المبلغ + التاريخ + شي ملاحظة',
        fr: 'Montant + date + note'
      },
    },
    {
      number: '4',
      icon: '✅',
      title: { ar: 'تبع الخلاص', fr: 'Suivez les paiements' },
      description: {
        ar: 'شوف شكون خلص و شكون مازال',
        fr: 'Voyez qui a payé et qui doit encore'
      },
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('كيفاش خدام؟', 'Comment ça marche?')}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center"
            >
              {/* Connector line - hidden on mobile and last item */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              {/* Step card */}
              <div className="relative">
                {/* Number badge */}
                <div className="w-20 h-20 mx-auto mb-4 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-4xl relative z-10">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-accent-foreground z-20">
                  {step.number}
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2 text-foreground">
                {isArabic ? step.title.ar : step.title.fr}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isArabic ? step.description.ar : step.description.fr}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
