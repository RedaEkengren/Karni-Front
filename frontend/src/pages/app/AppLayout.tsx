import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { initSync, setupAutoSync, fullSync } from '@/services/sync';
import { db } from '@/db';
import BottomNav from '@/components/app/BottomNav';
import SyncStatus from '@/components/app/SyncStatus';

const AppLayout = () => {
  const { t } = useLanguage();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { setSyncStatus, setPendingChanges } = useAppStore();

  // Initialize sync on mount
  useEffect(() => {
    initSync();
    setupAutoSync(() => useAuthStore.getState().token);

    // Initial sync
    if (token) {
      setSyncStatus('syncing');
      fullSync(token)
        .then((success) => {
          setSyncStatus(success ? 'success' : 'error');
          // Reset to idle after 2 seconds
          setTimeout(() => setSyncStatus('idle'), 2000);
        })
        .catch(() => setSyncStatus('error'));
    }
  }, [token, setSyncStatus]);

  // Watch pending changes
  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await db.syncQueue.count();
      setPendingChanges(count);
    };

    updatePendingCount();

    // Poll for changes
    const interval = setInterval(updatePendingCount, 5000);
    return () => clearInterval(interval);
  }, [setPendingChanges]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border safe-area-pt">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">📓</span>
            <span className="font-bold text-lg">{t('رصيدي', 'Rassidi')}</span>
          </div>
          <SyncStatus />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
