import React, { useState } from 'react';
import { Check, Trash2, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TransactionItem {
  id: string;
  item_name: string;
  price: number;
}

interface TransactionCardProps {
  id: string;
  totalAmount: number;
  isPaid: boolean;
  notes?: string | null;
  createdAt: string;
  paidAt?: string | null;
  items?: TransactionItem[];
  clientName?: string;
  onMarkAsPaid?: (id: string) => void;
  onDelete?: (id: string) => void;
  showClientName?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  id,
  totalAmount,
  isPaid,
  notes,
  createdAt,
  paidAt,
  items = [],
  clientName,
  onMarkAsPaid,
  onDelete,
  showClientName = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={cn(
        'border-border/50 transition-all overflow-hidden',
        isPaid ? 'bg-muted/30' : 'bg-card'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {showClientName && clientName && (
              <p className="font-semibold text-primary mb-1">{clientName}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {formatDate(createdAt)}
            </p>
            {notes && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notes}
              </p>
            )}
            {isPaid && paidAt && (
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                تم الدفع: {formatDate(paidAt)}
              </p>
            )}
          </div>

          <div className="text-left flex-shrink-0">
            <p
              className={cn(
                'font-bold currency text-lg',
                isPaid ? 'text-muted-foreground line-through' : 'text-destructive'
              )}
            >
              {formatCurrency(totalAmount)}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
              <Package className="w-3 h-3" />
              {items.length} منتجات
            </p>
          </div>
        </div>

        {/* Expand/Collapse Items */}
        {items.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-3 pt-3 border-t border-border/50 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                إخفاء التفاصيل
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                عرض التفاصيل
              </>
            )}
          </button>
        )}

        {/* Items List */}
        {expanded && items.length > 0 && (
          <div className="mt-3 space-y-2 animate-fade-in">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg text-sm"
              >
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  {item.item_name}
                </span>
                <span className="font-medium currency">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isPaid && (onMarkAsPaid || onDelete) && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
            {onMarkAsPaid && (
              <Button
                onClick={() => onMarkAsPaid(id)}
                size="sm"
                className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              >
                <Check className="w-4 h-4 ml-1" />
                تم الدفع
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف الدين</AlertDialogTitle>
                    <AlertDialogDescription>
                      هل أنت متأكد من حذف هذا الدين؟ لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row-reverse gap-2">
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
