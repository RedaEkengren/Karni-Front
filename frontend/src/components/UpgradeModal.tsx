import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: 'clients' | 'items';
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onOpenChange,
  reason = 'clients',
}) => {
  const handleUpgrade = () => {
    // TODO: Implement Stripe checkout
    console.log('Upgrade to premium');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-right" dir="rtl">
        <DialogHeader className="text-right">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <Crown className="w-8 h-8 text-accent-foreground" />
          </div>
          <DialogTitle className="text-xl text-center">
            ترقية إلى الخطة المميزة
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            {reason === 'clients'
              ? 'لقد وصلت إلى الحد الأقصى للزبائن (20 زبائن) في الخطة المجانية.'
              : 'لقد وصلت إلى الحد الأقصى للمنتجات (100 منتج) لهذا الزبون  .'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              مميزات الخطة المميزة:
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                عدد غير محدود من الزبائن
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                عدد غير محدود من المنتجات
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                بدون إعلانات
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                تصدير البيانات إلى Excel
              </li>
            </ul>
          </div>

          <div className="text-center py-2">
            <p className="text-2xl font-bold text-primary">99 د.م.</p>
            <p className="text-sm text-muted-foreground">شهرياً</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleUpgrade} className="btn-gold w-full py-6 text-lg">
              <Crown className="w-5 h-5 ml-2" />
              ترقية الآن
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              ليس الآن
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
