import { useLanguage } from '@/contexts/LanguageContext';
import { Cloud, Wifi, Zap, MessageCircle, Fingerprint, Bell } from 'lucide-react';

const SolutionSection = () => {
  const { t, isArabic } = useLanguage();

  const solutions = [
    {
      icon: Cloud,
      title: { ar: 'ما عمرها تضيع', fr: 'Jamais de perte' },
      description: {
        ar: 'backup تلقائي - حتى لو ضاع التيليفون، الديون محفوظين 100%',
        fr: 'Sauvegarde auto - même si le téléphone est perdu, tout est sauvegardé'
      },
      highlight: true,
    },
    {
      icon: MessageCircle,
      title: { ar: 'دعم 24/7 بالدارجة', fr: 'Support 24/7 en darija' },
      description: {
        ar: 'شات بوت ذكي كيجاوبك على أي سؤال - نهار ليل',
        fr: 'Chatbot IA qui répond à toutes vos questions - jour et nuit'
      },
      highlight: true,
    },
    {
      icon: Bell,
      title: { ar: 'تذكير WhatsApp', fr: 'Rappels WhatsApp' },
      description: {
        ar: 'ذكّر زبائنك بالديون عبر WhatsApp - أحسن من SMS',
        fr: 'Rappelez vos clients via WhatsApp - mieux que SMS'
      },
      highlight: false,
    },
    {
      icon: Fingerprint,
      title: { ar: 'قفل بالبصمة', fr: 'Verrouillage biométrique' },
      description: {
        ar: 'حمي معلوماتك بالبصمة أو Face ID',
        fr: 'Protégez vos données avec empreinte ou Face ID'
      },
      highlight: false,
    },
    {
      icon: Wifi,
      title: { ar: 'خدام بلا انترنت', fr: 'Fonctionne hors ligne' },
      description: {
        ar: 'سجل الديون حتى فالبادية بلا ريزو',
        fr: 'Enregistrez les dettes même sans connexion'
      },
      highlight: false,
    },
    {
      icon: Zap,
      title: { ar: 'ساهل بزاف', fr: 'Super simple' },
      description: {
        ar: 'كتب الإسم، كتب المبلغ، صافي!',
        fr: 'Écrivez le nom, le montant, c\'est fait!'
      },
      highlight: false,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          {t('الحل بسيط', 'La solution est simple')} 👇
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto text-lg">
          {t(
            'سمارت كارني كيخليك تسجل و تتبع الديون ديال الزبائن بطريقة ساهلة و آمنة',
            'Smart Karni vous permet d\'enregistrer et suivre les dettes de vos clients facilement et en toute sécurité'
          )}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className={`notebook-card group hover:border-accent transition-colors ${
                solution.highlight ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              {solution.highlight && (
                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                  {isArabic ? 'جديد' : 'Nouveau'}
                </div>
              )}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                solution.highlight ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'
              }`}>
                <solution.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {isArabic ? solution.title.ar : solution.title.fr}
              </h3>
              <p className="text-muted-foreground">
                {isArabic ? solution.description.ar : solution.description.fr}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
