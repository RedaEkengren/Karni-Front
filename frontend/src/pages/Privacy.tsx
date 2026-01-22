import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Privacy = () => {
  const { t, isArabic } = useLanguage();

  const sections = [
    {
      title: { ar: 'المعلومات لي كنجمعو', fr: 'Informations collectées' },
      content: {
        ar: 'كنجمعو غير المعلومات لي خاصين باش التطبيق يخدم: الإسم ديالك، رقم التيليفون، و معلومات الزبائن لي كتسجلهم. ما كنجمعو حتى شي معلومة ما خاصاش.',
        fr: 'Nous collectons uniquement les informations nécessaires au fonctionnement de l\'app: votre nom, numéro de téléphone, et les informations des clients que vous enregistrez. Rien de plus.'
      },
    },
    {
      title: { ar: 'كيفاش كنستعملو المعلومات', fr: 'Utilisation des données' },
      content: {
        ar: 'المعلومات ديالك كنستعملوها غير باش نخليو التطبيق يخدم ليك. ما كنبيعو المعلومات لحتى واحد، ما كنشاركوها مع حتى شركة.',
        fr: 'Vos informations sont utilisées uniquement pour faire fonctionner l\'application. Nous ne vendons jamais vos données et ne les partageons avec aucune entreprise.'
      },
    },
    {
      title: { ar: 'الأمان', fr: 'Sécurité' },
      content: {
        ar: 'المعلومات ديالك محمية بتقنيات الأمان العالية. كنستعملو التشفير (encryption) باش نحميو البيانات ديالك.',
        fr: 'Vos informations sont protégées par des technologies de sécurité avancées. Nous utilisons le chiffrement pour protéger vos données.'
      },
    },
    {
      title: { ar: 'حقوقك', fr: 'Vos droits' },
      content: {
        ar: 'عندك الحق تشوف المعلومات ديالك، تصححها، أو تمسحها كلها. إلا بغيتي تمسح الحساب ديالك، راسلنا و غادي نمسحو كلشي.',
        fr: 'Vous avez le droit de consulter, corriger ou supprimer toutes vos informations. Si vous voulez supprimer votre compte, contactez-nous et nous effacerons tout.'
      },
    },
    {
      title: { ar: 'الإشهارات', fr: 'Publicités' },
      content: {
        ar: 'ما كاينش إشهارات فالتطبيق. ما غادي نبعتو ليك حتى رسالة إشهارية.',
        fr: 'Il n\'y a pas de publicités dans l\'application. Nous ne vous enverrons jamais de messages publicitaires.'
      },
    },
    {
      title: { ar: 'التعديلات', fr: 'Modifications' },
      content: {
        ar: 'إلا بدلنا شي حاجة فسياسة الخصوصية، غادي نخبروك قبل.',
        fr: 'Si nous modifions cette politique de confidentialité, nous vous en informerons à l\'avance.'
      },
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('سياسة الخصوصية', 'Politique de confidentialité')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'المعلومات ديالك آمنة معانا',
              'Vos informations sont en sécurité avec nous'
            )}
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            {/* Trust Badge */}
            <div className="flex justify-center mb-12">
              <div className="trust-badge text-lg">
                🔒 {t('معلوماتك سرية 100%', 'Vos données sont 100% privées')}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <div key={index} className="notebook-card">
                  <h2 className="text-xl font-bold mb-4 text-primary">
                    {isArabic ? section.title.ar : section.title.fr}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {isArabic ? section.content.ar : section.content.fr}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact for questions */}
            <div className="mt-12 p-8 bg-primary text-primary-foreground rounded-2xl text-center">
              <p className="text-lg mb-4">
                {t(
                  'عندك سؤال على الخصوصية؟ راسلنا!',
                  'Une question sur la confidentialité? Contactez-nous!'
                )}
              </p>
              <a href="/contact" className="btn-gold">
                {t('تواصل معانا', 'Nous contacter')}
              </a>
            </div>

            {/* Last updated */}
            <p className="text-center text-muted-foreground text-sm mt-8">
              {t(
                'آخر تحديث: يناير 2025',
                'Dernière mise à jour: Janvier 2025'
              )}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
