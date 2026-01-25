import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cloud, Wifi, Zap, Users, BarChart3, MessageSquare, FileText, Fingerprint } from 'lucide-react';

const Features = () => {
  const { t, isArabic } = useLanguage();

  const features = [
    {
      icon: Users,
      title: { ar: 'إدارة الزبائن', fr: 'Gestion clients' },
      description: {
        ar: 'زيد الزبائن بالإسم و رقم التيليفون. شوف التاريخ ديال كل واحد.',
        fr: 'Ajoutez les clients par nom et numéro. Consultez l\'historique de chacun.'
      },
    },
    {
      icon: Zap,
      title: { ar: 'تسجيل الديون', fr: 'Enregistrement des dettes' },
      description: {
        ar: 'سجل أي دين فثواني. المبلغ، التاريخ، و شي ملاحظة إلا بغيتي.',
        fr: 'Enregistrez une dette en secondes. Montant, date, et note optionnelle.'
      },
    },
    {
      icon: BarChart3,
      title: { ar: 'الإحصائيات', fr: 'Statistiques' },
      description: {
        ar: 'شحال عندك من دين؟ شكون كيخلص مزيان؟ كلشي واضح.',
        fr: 'Combien de dettes? Qui paie bien? Tout est clair.'
      },
    },
    {
      icon: Wifi,
      title: { ar: 'بلا انترنت', fr: 'Hors ligne' },
      description: {
        ar: 'سجل و شوف الديون حتى فالبادية. كيتسنكرونيزا ملي تكون عندك الويفي.',
        fr: 'Enregistrez et consultez même sans connexion. Synchronisation automatique.'
      },
    },
    {
      icon: MessageSquare,
      title: { ar: 'تذكير WhatsApp', fr: 'Rappels WhatsApp' },
      description: {
        ar: 'بعت رسالة للزبون باش تفكرو بالدين (Premium)',
        fr: 'Envoyez un rappel au client via WhatsApp (Premium)'
      },
      premium: true,
    },
    {
      icon: FileText,
      title: { ar: 'Export PDF', fr: 'Export PDF' },
      description: {
        ar: 'طبع لائحة الديون إلا حتاجيتيها (Premium)',
        fr: 'Imprimez la liste des dettes si vous en avez besoin (Premium)'
      },
      premium: true,
    },
    {
      icon: Cloud,
      title: { ar: 'محفوظ فالسحاب', fr: 'Sauvegarde cloud' },
      description: {
        ar: 'حتى لو ضاع التيليفون، الديون محفوظين بأمان.',
        fr: 'Même si le téléphone est perdu, les dettes sont sauvegardées en sécurité.'
      },
    },
    {
      icon: Fingerprint,
      title: { ar: 'قفل بالبصمة', fr: 'Verrouillage biométrique' },
      description: {
        ar: 'حمي المعلومات ديالك بالبصمة أو الكود (Premium)',
        fr: 'Protégez vos données avec empreinte ou code (Premium)'
      },
      premium: true,
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('المميزات', 'Fonctionnalités')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'كلشي لي خاصك، بلا ما تعقد راسك',
              'Tout ce dont vous avez besoin, sans complications'
            )}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card relative"
              >
                {feature.premium && (
                  <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                    Premium
                  </span>
                )}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  {isArabic ? feature.title.ar : feature.title.fr}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {isArabic ? feature.description.ar : feature.description.fr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('جرب سمارت كارني دابا', 'Essayez Smart Karni maintenant')}
          </h2>
          <a href="/#download" className="btn-gold">
            {t('نزّل التطبيق مجانا', 'Télécharger gratuitement')}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Features;
