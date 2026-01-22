import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2, Package, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { FREE_PLAN_LIMITS } from '@/lib/constants';

interface TransactionItem {
  id: string;
  item_name: string;
  price: string;
}

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  currentItemCount: number;
  onSubmit: (data: {
    clientId: string;
    items: { item_name: string; price: number }[];
    notes?: string;
  }) => Promise<void>;
  onUpgradeNeeded: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  currentItemCount,
  onSubmit,
  onUpgradeNeeded,
}) => {
  const { profile } = useAuth();
  const [items, setItems] = useState<TransactionItem[]>([
    { id: '1', item_name: '', price: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const isPremium = profile?.is_premium ?? false;
  const maxItems = isPremium ? Infinity : FREE_PLAN_LIMITS.MAX_ITEMS_PER_CLIENT;
  const remainingItems = maxItems - currentItemCount;

  const addItem = () => {
    if (!isPremium && items.length >= remainingItems) {
      onUpgradeNeeded();
      return;
    }
    setItems([
      ...items,
      { id: Date.now().toString(), item_name: '', price: '' },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: 'item_name' | 'price', value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = items.filter(
      (item) => item.item_name.trim() && parseFloat(item.price) > 0
    );

    if (validItems.length === 0) return;

    // Check item limit
    if (!isPremium && currentItemCount + validItems.length > FREE_PLAN_LIMITS.MAX_ITEMS_PER_CLIENT) {
      onUpgradeNeeded();
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        clientId,
        items: validItems.map((item) => ({
          item_name: item.item_name.trim(),
          price: parseFloat(item.price),
        })),
        notes: notes.trim() || undefined,
      });
      setItems([{ id: '1', item_name: '', price: '' }]);
      setNotes('');
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            إضافة دين جديد - {clientName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isPremium && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm">
              <p className="text-warning-foreground">
                يمكنك إضافة {remainingItems} منتج إضافي (الخطة المجانية: {FREE_PLAN_LIMITS.MAX_ITEMS_PER_CLIENT} منتج)
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label>المنتجات</Label>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-2 items-start animate-fade-in"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="اسم المنتج"
                    value={item.item_name}
                    onChange={(e) =>
                      updateItem(item.id, 'item_name', e.target.value)
                    }
                    required={index === 0}
                  />
                </div>
                <div className="w-28">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="السعر"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(item.id, 'price', e.target.value)
                    }
                    required={index === 0}
                    dir="ltr"
                    className="text-right"
                  />
                </div>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 ml-1" />
              إضافة منتج آخر
            </Button>
          </div>

          {/* Total */}
          <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <Calculator className="w-5 h-5 text-primary" />
              المجموع الكلي
            </span>
            <span className="text-xl font-bold text-primary currency">
              {formatCurrency(totalAmount)}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات إضافية..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1 btn-gradient" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
              ) : (
                <Plus className="w-4 h-4 ml-2" />
              )}
              إضافة الدين
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
