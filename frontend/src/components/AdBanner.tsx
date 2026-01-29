import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Book, Sparkles, ChevronLeft } from 'lucide-react'; // Assuming you use lucide-react

interface AdBannerProps {
  position: 'top' | 'bottom';
}

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const { profile } = useAuth();

  if (profile?.is_premium) {
    return null;
  }

  return (
    <div className={`mx-4 my-4 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-l from-primary/5 to-transparent ${position === 'top' ? 'mt-6' : 'mb-6'}`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Book size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1">
              تهني من الدفتر والستيلو! <Sparkles size={14} className="text-yellow-500" />
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              نظم حسابات الحانوت ديالك بسهولة وأمان في هاتفك
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          جرب الآن
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
};
