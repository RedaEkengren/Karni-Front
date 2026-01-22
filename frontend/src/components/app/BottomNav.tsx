import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Users, Heart, MessageCircle, Settings } from 'lucide-react';

const BottomNav = () => {
  const { isArabic } = useLanguage();

  const navItems = [
    {
      path: '/app',
      icon: Home,
      label: { ar: 'الرئيسية', fr: 'Accueil' },
      end: true,
    },
    {
      path: '/app/customers',
      icon: Users,
      label: { ar: 'الزبائن', fr: 'Clients' },
    },
    {
      path: '/app/sadaqa',
      icon: Heart,
      label: { ar: 'صدقة', fr: 'Sadaqa' },
    },
    {
      path: '/app/chat',
      icon: MessageCircle,
      label: { ar: 'مساعدة', fr: 'Aide' },
    },
    {
      path: '/app/settings',
      icon: Settings,
      label: { ar: 'إعدادات', fr: 'Paramètres' },
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">
              {isArabic ? item.label.ar : item.label.fr}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
