import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const { profile } = useAuth();

  // Don't show ads for premium users
  if (profile?.is_premium) {
    return null;
  }

  return (
    <div className={`ad-banner mx-4 my-3 ${position === 'top' ? 'mt-4' : 'mb-4'}`}>
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">📢 مساحة إعلانية</p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          ترقية إلى الخطة المميزة لإزالة الإعلانات
        </p>
      </div>
    </div>
  );
};
