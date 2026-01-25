import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, ArrowRight, Search, Plus, ChevronRight, Check } from 'lucide-react';

const Preview = () => {
  const { t, isArabic } = useLanguage();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const customers = [
    { name: { ar: 'عبد الرحمان', fr: 'Abderrahmane' }, amount: 850, lastDate: { ar: '15 يناير', fr: '15 Jan' } },
    { name: { ar: 'فاطمة الزهراء', fr: 'Fatima Zahra' }, amount: 420, lastDate: { ar: '12 يناير', fr: '12 Jan' } },
    { name: { ar: 'يوسف', fr: 'Youssef' }, amount: 1200, lastDate: { ar: '10 يناير', fr: '10 Jan' } },
    { name: { ar: 'خديجة', fr: 'Khadija' }, amount: 0, lastDate: { ar: '8 يناير', fr: '8 Jan' }, paid: true },
  ];

  const transactions = [
    { date: { ar: '15 يناير 2025', fr: '15 Jan 2025' }, amount: 150, note: { ar: 'زيت + سكر + أتاي', fr: 'Huile + sucre + thé' } },
    { date: { ar: '10 يناير 2025', fr: '10 Jan 2025' }, amount: 300, note: { ar: 'مشتريات الأسبوع', fr: 'Courses de la semaine' } },
    { date: { ar: '5 يناير 2025', fr: '5 Jan 2025' }, amount: -200, note: { ar: 'خلاص', fr: 'Paiement' }, isPayment: true },
    { date: { ar: '1 يناير 2025', fr: '1 Jan 2025' }, amount: 600, note: { ar: 'رأس العام', fr: 'Nouvel an' } },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('شوف كيفاش التطبيق من الداخل', 'Découvrez l\'application')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'معاينة ديال الواجهة - هادي ماشي النسخة الحقيقية',
              'Aperçu de l\'interface - Ceci est une démo'
            )}
          </p>
          <div className="mt-4 inline-block bg-warning/10 text-warning-foreground px-4 py-2 rounded-full text-sm font-medium">
            📱 {t('هادي معاينة فقط', 'Démo uniquement')}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-12 md:py-16">
        <div className="section-container">
          {/* Phone Mockup */}
          <div className="max-w-sm mx-auto">
            <div className="phone-mockup">
              <div className="phone-mockup-screen">
                {/* App Header */}
                <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                  <span className="font-bold">{t('سمارت كارني', 'Smart Karni')}</span>
                  <span className="text-sm opacity-80">
                    {t('محمد - مول الحانوت', 'Mohammed - Épicier')}
                  </span>
                </div>

                {/* Stats Cards */}
                <div className="p-4 grid grid-cols-3 gap-2">
                  <div className="stat-card">
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('مجموع الديون', 'Total dettes')}
                    </div>
                    <div className="text-lg font-bold text-primary">4,250 dh</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('عدد الزبائن', 'Clients')}
                    </div>
                    <div className="text-lg font-bold text-primary">18</div>
                  </div>
                  <div className="stat-card">
                    <div className="text-xs text-muted-foreground mb-1">
                      {t('هاد الشهر', 'Ce mois')}
                    </div>
                    <div className="text-lg font-bold text-success">1,200 dh</div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 mb-4">
                  <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">
                      {t('قلب على زبون...', 'Rechercher un client...')}
                    </span>
                  </div>
                </div>

                {/* Customer List */}
                <div className="px-4 space-y-2">
                  {customers.map((customer, index) => (
                    <div
                      key={index}
                      className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          👤
                        </div>
                        <div>
                          <div className="font-semibold text-sm">
                            {isArabic ? customer.name.ar : customer.name.fr}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t('آخر دين:', 'Dernière dette:')} {isArabic ? customer.lastDate.ar : customer.lastDate.fr}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {customer.paid ? (
                          <span className="text-success text-xs font-medium flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {t('خلصات', 'Payé')}
                          </span>
                        ) : (
                          <span className="font-bold text-primary">{customer.amount} dh</span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAB */}
                <div className="absolute bottom-4 right-4">
                  <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Callouts */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Arrow className="w-4 h-4 text-primary" />
                <span>{t('شوف مجموع الديون فلحظة', 'Voyez le total des dettes instantanément')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Arrow className="w-4 h-4 text-primary" />
                <span>{t('قلب على أي زبون بالإسم', 'Recherchez n\'importe quel client par nom')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Arrow className="w-4 h-4 text-primary" />
                <span>{t('زيد دين جديد بضغطة وحدة', 'Ajoutez une dette en un clic')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Detail Preview */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('تفاصيل الزبون', 'Détails du client')}
          </h2>

          <div className="max-w-sm mx-auto">
            <div className="phone-mockup">
              <div className="phone-mockup-screen">
                {/* Header */}
                <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  <span className="font-bold">{t('عبد الرحمان', 'Abderrahmane')}</span>
                </div>

                {/* Customer Info */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">
                      👤
                    </div>
                    <div>
                      <div className="font-bold text-lg">
                        {t('عبد الرحمان', 'Abderrahmane')}
                      </div>
                      <div className="text-muted-foreground text-sm">📱 0661-XXXXXX</div>
                      <div className="text-xl font-bold text-primary mt-1">
                        {t('المجموع:', 'Total:')} 850 dh
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border ${
                        tx.isPayment ? 'bg-success/5 border-success/20' : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          📅 {isArabic ? tx.date.ar : tx.date.fr}
                        </span>
                        <span className={`font-bold ${tx.isPayment ? 'text-success' : 'text-primary'}`}>
                          {tx.isPayment ? '−' : '+'}{Math.abs(tx.amount)} dh
                          {tx.isPayment && <Check className="w-4 h-4 inline ml-1" />}
                        </span>
                      </div>
                      {tx.note && (
                        <p className="text-sm text-muted-foreground">
                          📝 {isArabic ? tx.note.ar : tx.note.fr}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-muted/50 grid grid-cols-3 gap-2">
                  <button className="bg-primary text-primary-foreground py-2 px-3 rounded-lg text-xs font-medium">
                    {t('زيد دين', 'Ajouter')}
                  </button>
                  <button className="bg-success text-success-foreground py-2 px-3 rounded-lg text-xs font-medium">
                    {t('سجل خلاص', 'Paiement')}
                  </button>
                  <button className="bg-secondary text-secondary-foreground py-2 px-3 rounded-lg text-xs font-medium">
                    💬 {t('ذكّرو', 'Rappel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('عجبك؟ نزّل التطبيق دابا!', 'Ça vous plaît? Téléchargez maintenant!')}
          </h2>
          <a href="/#download" className="btn-gold text-lg inline-flex">
            {t('نزّل التطبيق', 'Télécharger')}
            <Arrow className="w-5 h-5" />
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Preview;
