import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
// Added Share to the imports
import { Menu, X, LogIn, User, Download, Share } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const isIOS = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent);

const isInStandaloneMode = () =>
  (window.navigator as any).standalone === true;

const Header = () => {
  const { isArabic, toggleLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuthStore();
  const { isInstallable, install } = usePWAInstall();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FIX 1: Defined the missing state
  const [showIOSPopup, setShowIOSPopup] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (isIOS() && !isInStandaloneMode()) {
      const alreadyShown = localStorage.getItem('ios-install-shown');
      if (!alreadyShown) {
        setShowIOSPopup(true);
        localStorage.setItem('ios-install-shown', 'true');
      }
    }
  }, []);

  const navLinks = [
    { path: '/', label: { ar: 'الرئيسية', fr: 'Accueil' } },
    { path: '/features', label: { ar: 'المميزات', fr: 'Fonctionnalités' } },
    { path: '/pricing', label: { ar: 'الأثمنة', fr: 'Tarifs' } },
    { path: '/preview', label: { ar: 'معاينة', fr: 'Aperçu' } },
    { path: '/contact', label: { ar: 'تواصل', fr: 'Contact' } },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <> {/* Fragment starts here */}
      {/* iOS Install Popup */}
      {showIOSPopup && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-background rounded-t-2xl sm:rounded-2xl p-5 max-w-md w-full animate-fade-in">
            <h3 className="font-bold text-lg mb-2">
              {t('تثبيت التطبيق', 'Installer l’application')}
            </h3>
            <p className="text-sm text-foreground/70 mb-4">
              {t(
                'لتثبيت التطبيق على الآيفون، اضغط على زر المشاركة ثم اختر "إضافة إلى الشاشة الرئيسية".',
                'Pour installer l’application sur iPhone, appuyez sur Partager puis "Ajouter à l’écran d’accueil".'
              )}
            </p>

            <div className="flex items-center gap-2 text-sm bg-muted rounded-lg p-3 mb-4">
              <Share size={18} />
              <span>
                {t('مشاركة → إضافة إلى الشاشة الرئيسية', 'Partager → Ajouter à l’écran')}
              </span>
            </div>

            <button
              onClick={() => setShowIOSPopup(false)}
              className="btn-primary w-full"
            >
              {t('فهمت', 'Compris')}
            </button>
          </div>
        </div>
      )}
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src="/icon-512.png"
                alt="Smart Karni Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-lg md:text-xl text-primary">
              {t('سمارت كارني', 'Smart Karni')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
              >
                {isArabic ? link.label.ar : link.label.fr}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted"
            >
              {isArabic ? 'FR' : 'ع'}
            </button>

            {/* PWA Install – Desktop */}
            {isInstallable && (
              <button
                onClick={install}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
              >
                <Download size={16} />
                {t('تحميل التطبيق', 'Installer')}
              </button>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex btn-primary !px-4 !py-2 !text-sm gap-2"
              >
                <User size={16} />
                {t('التطبيق', 'Mon App')}
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground"
                >
                  <LogIn size={16} />
                  {t('دخول', 'Connexion')}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex btn-primary !px-4 !py-2 !text-sm"
                >
                  {t('ابدأ مجانا', 'Commencer')}
                </Link>
              </>
            )}

            {/* PWA Install – Mobile (icon) */}
            {isInstallable && (
              <button
                onClick={install}
                className="md:hidden p-2 rounded-lg bg-muted hover:bg-muted/80"
                aria-label="Install app"
              >
                <Download size={20} />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">

              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:bg-muted'
                  }`}
                >
                  {isArabic ? link.label.ar : link.label.fr}
                </Link>
              ))}

              <div className="border-t border-border mt-2 pt-2 flex flex-col gap-1">

                {/* PWA Install – Mobile Menu */}
                {isInstallable && (
                  <button
                    onClick={() => {
                      install();
                      setIsMenuOpen(false);
                    }}
                    className="btn-secondary"
                  >
                    <Download size={18} />
                    {t('تحميل التطبيق', 'Installer l’application')}
                  </button>
                )}

                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary"
                  >
                    <User size={18} />
                    {t('التطبيق', 'Mon App')}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 rounded-lg font-medium text-foreground/70 hover:bg-muted flex items-center gap-2"
                    >
                      <LogIn size={18} />
                      {t('دخول', 'Connexion')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="btn-primary"
                    >
                      {t('ابدأ مجانا', 'Commencer gratuitement')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;
