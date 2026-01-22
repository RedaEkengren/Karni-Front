import { useLanguage } from '@/contexts/LanguageContext';

const ProblemSection = () => {
  const { t, isArabic } = useLanguage();

  const problems = [
    {
      icon: '📓',
      title: { ar: 'الكارني كيتوسخ', fr: 'Carnet abîmé' },
      description: {
        ar: 'المطر، القهوة، الولاد... الكارني ديما فخطر',
        fr: 'La pluie, le café, les enfants... le carnet est toujours en danger'
      },
    },
    {
      icon: '🤔',
      title: { ar: 'نسيان الديون', fr: 'Oubli des dettes' },
      description: {
        ar: 'شكون خلص؟ شحال بقا؟ راسك كيدور',
        fr: 'Qui a payé? Combien reste? C\'est confus'
      },
    },
    {
      icon: '😤',
      title: { ar: 'المشاكل مع الزبناء', fr: 'Conflits clients' },
      description: {
        ar: '"أنا خلصت!" - "لا ما خلصتيش!" - بلا دليل',
        fr: '"J\'ai payé!" - "Non!" - Sans preuve'
      },
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('المشاكل لي كنعرفوها مزيان', 'Les problèmes qu\'on connaît bien')}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="feature-card text-center group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {problem.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {isArabic ? problem.title.ar : problem.title.fr}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? problem.description.ar : problem.description.fr}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
