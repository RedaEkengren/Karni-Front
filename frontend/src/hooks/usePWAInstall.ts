import { useEffect, useState } from 'react';
import { trackInstall } from '@/lib/installTracker';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // ✅ REAL install tracking
  useEffect(() => {
    const installedHandler = () => {
      trackInstall('pwa');
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('appinstalled', installedHandler);
    return () => window.removeEventListener('appinstalled', installedHandler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
  };

  return { isInstallable, install };
}
