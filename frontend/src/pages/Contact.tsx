import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { Send, MessageCircle, Mail } from 'lucide-react';

const Contact = () => {
  const { t, isArabic } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert(isArabic ? 'شكرا! غادي نتواصلو معاك قريبا' : 'Merci! Nous vous contacterons bientôt');
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('تواصل معانا', 'Contactez-nous')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'عندك سؤال؟ راسلنا!',
              'Une question? Écrivez-nous!'
            )}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h2 className="text-2xl font-bold mb-6">
                {t('راسلنا', 'Envoyez un message')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('الإسم', 'Nom')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder={isArabic ? 'الإسم ديالك' : 'Votre nom'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('رقم الواتساب', 'Numéro WhatsApp')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+212 6XX XXX XXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('الرسالة', 'Message')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder={isArabic ? 'أش بغيتي تقولينا؟' : 'Que voulez-vous nous dire?'}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Send className="w-5 h-5" />
                  {t('بعت الرسالة', 'Envoyer')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {t('أو تواصل معانا مباشرة', 'Ou contactez-nous directement')}
                </h2>
                
                <div className="space-y-6">
                  <a
                    href="https://wa.me/212XXXXXXXXX"
                    className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary transition-colors group"
                  >
                    <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
                      <MessageCircle className="w-7 h-7 text-success" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">WhatsApp</div>
                      <div className="text-muted-foreground">+212 XXX XXX XXX</div>
                    </div>
                  </a>

                  <a
                    href="mailto:salam@rassidi.ma"
                    className="flex items-center gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary transition-colors group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">Email</div>
                      <div className="text-muted-foreground">salam@rassidi.ma</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Response time */}
              <div className="p-6 bg-secondary/50 rounded-xl text-center">
                <p className="text-lg">
                  ⏰ {t(
                    'كنجاوبو فأقل من 24 ساعة',
                    'Nous répondons en moins de 24h'
                  )}
                </p>
              </div>

              {/* Morocco flag */}
              <div className="text-center text-6xl">
                🇲🇦
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
