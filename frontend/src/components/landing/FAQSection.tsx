import { useLanguage } from '@/contexts/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const { t, isArabic } = useLanguage();

  const faqs = [
    {
      question: {
        ar: 'واش خاصني انترنت باش نستعمل التطبيق؟',
        fr: 'Ai-je besoin d\'internet pour utiliser l\'application?'
      },
      answer: {
        ar: 'لا! التطبيق خدام بلا انترنت. غير ملي تكون عندك الويفي، كيتسنكرونيزا بوحدو.',
        fr: 'Non! L\'application fonctionne hors ligne. Quand vous avez le wifi, elle se synchronise automatiquement.'
      },
    },
    {
      question: {
        ar: 'واش المعلومات ديالي محمية؟',
        fr: 'Mes informations sont-elles protégées?'
      },
      answer: {
        ar: 'نعم 100%. ما كنشاركو حتى معلومة مع حتى واحد. الداتا ديالك ديالك وحدك.',
        fr: 'Oui 100%. Nous ne partageons aucune information avec personne. Vos données sont à vous seul.'
      },
    },
    {
      question: {
        ar: 'إلا ضاع التيليفون ديالي؟',
        fr: 'Et si je perds mon téléphone?'
      },
      answer: {
        ar: 'ما كاين مشكل. دخل برقم التيليفون ديالك فتيليفون جديد و كلشي كيرجع.',
        fr: 'Pas de problème. Connectez-vous avec votre numéro sur un nouveau téléphone et tout revient.'
      },
    },
    {
      question: {
        ar: 'شحال من زبون نقدر نزيد فالنسخة المجانية؟',
        fr: 'Combien de clients puis-je ajouter en version gratuite?'
      },
      answer: {
        ar: '20 زبون. كافي للبداية!',
        fr: '20 clients. Suffisant pour commencer!'
      },
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t('أسئلة متكررة', 'Questions fréquentes')}
        </h2>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 border border-border"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  {isArabic ? faq.question.ar : faq.question.fr}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {isArabic ? faq.answer.ar : faq.answer.fr}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
