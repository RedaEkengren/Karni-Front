import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ar' | 'fr';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  isArabic: boolean;
  t: (ar: string, fr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('smartkarni-language');
    return (saved as Language) || 'ar';
  });

  const isArabic = language === 'ar';

  useEffect(() => {
    localStorage.setItem('smartkarni-language', language);
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isArabic]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'fr' : 'ar');
  };

  const t = (ar: string, fr: string) => isArabic ? ar : fr;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isArabic, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
