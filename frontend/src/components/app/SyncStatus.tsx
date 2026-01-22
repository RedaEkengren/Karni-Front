import { useLanguage } from '@/contexts/LanguageContext';
import { useAppStore } from '@/stores/appStore';
import { Wifi, WifiOff, RefreshCw, Check, AlertCircle } from 'lucide-react';

const SyncStatus = () => {
  const { t } = useLanguage();
  const { isOnline, syncStatus, pendingChanges } = useAppStore();

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-warning text-sm">
        <WifiOff className="w-4 h-4" />
        <span>{t('غير متصل', 'Hors ligne')}</span>
        {pendingChanges > 0 && (
          <span className="bg-warning/20 px-2 py-0.5 rounded-full text-xs">
            {pendingChanges}
          </span>
        )}
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div className="flex items-center gap-2 text-primary text-sm">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span>{t('جاري المزامنة...', 'Synchronisation...')}</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>{t('خطأ في المزامنة', 'Erreur de sync')}</span>
      </div>
    );
  }

  if (syncStatus === 'success') {
    return (
      <div className="flex items-center gap-2 text-success text-sm">
        <Check className="w-4 h-4" />
        <span>{t('متزامن', 'Synchronisé')}</span>
      </div>
    );
  }

  // Idle - just show online status
  return (
    <div className="flex items-center gap-2 text-success text-sm">
      <Wifi className="w-4 h-4" />
      <span>{t('متصل', 'En ligne')}</span>
    </div>
  );
};

export default SyncStatus;
