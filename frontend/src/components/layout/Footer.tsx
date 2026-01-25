import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, isArabic } = useLanguage();

  const footerLinks = [
    { path: '/', label: { ar: 'الرئيسية', fr: 'Accueil' } },
    { path: '/features', label: { ar: 'المميزات', fr: 'Fonctionnalités' } },
    { path: '/pricing', label: { ar: 'الأثمنة', fr: 'Tarifs' } },
    { path: '/contact', label: { ar: 'تواصل معانا', fr: 'Contact' } },
    { path: '/privacy', label: { ar: 'سياسة الخصوصية', fr: 'Confidentialité' } },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12 md:py-16">
      <div className="section-container">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
              <span className="text-2xl">📓</span>
            </div>
            <span className="font-bold text-2xl">
              {t('سمارت كارني', 'Smart Karni')}
            </span>
          </div>
          <p className="text-primary-foreground/80 max-w-md mx-auto">
            {t(
              'التطبيق المغربي لتسجيل الديون - ساهل، آمن، و ما كيتوسخش',
              'L\'application marocaine pour gérer les dettes - Simple, sécurisée, et fiable'
            )}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              {isArabic ? link.label.ar : link.label.fr}
            </Link>
          ))}
        </nav>

        {/* Social & Contact */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="#"
            className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Instagram"
          >
            📷
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="Facebook"
          >
            📘
          </a>
          <a
            href="#"
            className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full flex items-center justify-center transition-colors"
            aria-label="WhatsApp"
          >
            💬
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-primary-foreground/60 text-sm">
          <p>© 2025 {t('سمارت كارني. جميع الحقوق محفوظة', 'Smart Karni. Tous droits réservés')}</p>
          <p className="mt-2 flex items-center justify-center gap-2">
            🇲🇦 {t('صنع في المغرب بكل حب', 'Fait au Maroc avec amour')} ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
