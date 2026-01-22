import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { Globe, LogOut, User, Shield, Bell } from 'lucide-react';

const Settings = () => {
  const { t, isArabic, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{t('الإعدادات', 'Paramètres')}</h1>

      {/* Profile */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-bold">{user?.name || t('مستخدم', 'Utilisateur')}</p>
            <p className="text-sm text-muted-foreground" dir="ltr">{user?.phone}</p>
          </div>
          {user?.isPremium && (
            <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {/* Language */}
        <button
          onClick={toggleLanguage}
          className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 hover:border-primary transition-colors"
        >
          <Globe className="w-5 h-5 text-primary" />
          <span className="flex-1 text-start">{t('اللغة', 'Langue')}</span>
          <span className="text-muted-foreground">
            {isArabic ? 'العربية' : 'Français'}
          </span>
        </button>

        {/* Notifications - Premium */}
        <button
          className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 opacity-60"
          disabled
        >
          <Bell className="w-5 h-5 text-primary" />
          <span className="flex-1 text-start">{t('الإشعارات', 'Notifications')}</span>
          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Premium</span>
        </button>

        {/* Security - Premium */}
        <button
          className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 opacity-60"
          disabled
        >
          <Shield className="w-5 h-5 text-primary" />
          <span className="flex-1 text-start">{t('قفل البصمة', 'Verrouillage biométrique')}</span>
          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">Premium</span>
        </button>
      </div>

      {/* Premium CTA */}
      {!user?.isPremium && (
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 text-primary-foreground">
          <h3 className="font-bold mb-1">{t('ترقية لـ Premium', 'Passez à Premium')}</h3>
          <p className="text-sm opacity-80 mb-3">
            {t('زبائن بلا حدود، تذكير WhatsApp، قفل البصمة', 'Clients illimités, rappels WhatsApp, verrouillage')}
          </p>
          <p className="font-bold">40 {t('درهم/السنة', 'MAD/an')}</p>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-destructive/10 text-destructive rounded-xl p-4 flex items-center justify-center gap-2 hover:bg-destructive/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        {t('تسجيل الخروج', 'Déconnexion')}
      </button>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        Rassidi v1.0.0
      </p>
    </div>
  );
};

export default Settings;
