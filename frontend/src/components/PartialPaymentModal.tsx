import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Banknote, ArrowDown } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';

interface Transaction {
  id: string;
  total_amount: number;
  remaining_amount: number;
  created_at: string;
  client_name?: string;
}

interface PartialPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onPayment: (payments: { transactionId: string; amount: number }[]) => Promise<void>;
  clientName?: string;
}

export const PartialPaymentModal: React.FC<PartialPaymentModalProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          transactions,
                                                                          onPayment,
                                                                          clientName,
                                                                        }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalDebt = transactions.reduce((sum, t) => sum + t.remaining_amount, 0);
  const paymentAmount = parseFloat(amount) || 0;

  // Calculate how the payment will be distributed (FIFO)
  const calculateDistribution = () => {
    const distribution: { transaction: Transaction; paymentAmount: number }[] = [];
    let remainingPayment = paymentAmount;

    // Sort by created_at (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    for (const transaction of sortedTransactions) {
      if (remainingPayment <= 0) break;

      const amountToApply = Math.min(remainingPayment, transaction.remaining_amount);
      if (amountToApply > 0) {
        distribution.push({
          transaction,
          paymentAmount: amountToApply,
        });
        remainingPayment -= amountToApply;
      }
    }

    return distribution;
  };

  const distribution = calculateDistribution();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentAmount <= 0) {
      return;
    }

    setIsLoading(true);
    try {
      const payments = distribution.map((d) => ({
        transactionId: d.transaction.id,
        amount: d.paymentAmount,
      }));
      await onPayment(payments);
      setAmount('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            تسجيل دفعة
          </DialogTitle>
          <DialogDescription>
            {clientName ? `تسجيل دفعة لـ ${clientName}` : 'سيتم تطبيق الدفعة على أقدم الديون أولاً'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Total Outstanding */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">إجمالي الديون المستحقة</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalDebt)}</p>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ الدفعة</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              max={totalDebt}
              step="0.01"
              className="text-lg"
              dir="ltr"
              required
            />
          </div>

          {/* Distribution Preview */}
          {distribution.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <ArrowDown className="w-4 h-4" />
                توزيع الدفعة (الأقدم أولاً)
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {distribution.map((d, index) => (
                  <div
                    key={d.transaction.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg text-sm"
                  >
                    <div>
                      <span className="text-muted-foreground">دين #{index + 1}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(d.transaction.created_at).toLocaleDateString('ar-MA')}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-primary">
                        -{formatCurrency(d.paymentAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        من {formatCurrency(d.transaction.remaining_amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {paymentAmount > totalDebt && (
                <p className="text-sm text-amber-600">
                  ⚠️ المبلغ يتجاوز إجمالي الديون بـ {formatCurrency(paymentAmount - totalDebt)}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-gradient"
              disabled={isLoading || paymentAmount <= 0}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'تأكيد الدفع'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
