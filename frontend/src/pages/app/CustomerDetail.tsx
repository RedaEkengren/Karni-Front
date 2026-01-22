import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import {
  ArrowLeft, ArrowRight, User, Phone, Plus, Check, Trash2, MessageCircle
} from 'lucide-react';

const CustomerDetail = () => {
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const [showAddDebt, setShowAddDebt] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const customer = useLiveQuery(
    () => db.customers.get(id || ''),
    [id]
  );

  const debts = useLiveQuery(
    () => db.debts.filter((d) => d.customerId === id && !d.deletedAt).toArray(),
    [id]
  );

  const totalUnpaid = debts
    ?.filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0) || 0;

  const handleAddDebt = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const localId = nanoid();
    const now = new Date().toISOString();

    await db.debts.add({
      id: localId,
      customerId: id!,
      amount: numAmount,
      paidAmount: 0,
      note: note.trim() || undefined,
      isPaid: false,
      synced: false,
      createdAt: now,
      updatedAt: now,
    });

    await db.syncQueue.add({
      action: 'create',
      table: 'debts',
      localId,
      data: {
        customer_local_id: id,
        amount: numAmount,
        note: note.trim() || null,
      },
      timestamp: now,
    });

    setAmount('');
    setNote('');
    setShowAddDebt(false);
  };

  const handleMarkPaid = async (debtId: string) => {
    const now = new Date().toISOString();

    await db.debts.update(debtId, {
      isPaid: true,
      paidAt: now,
      paidVia: 'customer',
      updatedAt: now,
      synced: false,
    });

    await db.syncQueue.add({
      action: 'update',
      table: 'debts',
      localId: debtId,
      data: { is_paid: true },
      timestamp: now,
    });
  };

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('جاري التحميل...', 'Chargement...')}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Arrow className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold">{customer.name}</h1>
      </div>

      {/* Customer Info */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{customer.name}</h2>
            {customer.phone && (
              <p className="text-muted-foreground flex items-center gap-1" dir="ltr">
                <Phone className="w-4 h-4" />
                {customer.phone}
              </p>
            )}
          </div>
          <div className="text-end">
            <p className="text-sm text-muted-foreground">{t('الإجمالي', 'Total')}</p>
            <p className="text-2xl font-bold text-primary">
              {totalUnpaid.toLocaleString()} <span className="text-sm">{t('درهم', 'MAD')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Add Debt */}
      {showAddDebt ? (
        <div className="bg-card rounded-xl p-4 border border-primary mb-4">
          <h3 className="font-bold mb-3">{t('دين جديد', 'Nouvelle dette')}</h3>
          <div className="space-y-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('المبلغ (درهم)', 'Montant (MAD)')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background"
              autoFocus
            />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('ملاحظة (اختياري)', 'Note (optionnel)')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddDebt(false)}
                className="flex-1 py-2 rounded-xl border border-border"
              >
                {t('إلغاء', 'Annuler')}
              </button>
              <button
                onClick={handleAddDebt}
                disabled={!amount || parseFloat(amount) <= 0}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {t('حفظ', 'Enregistrer')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddDebt(true)}
          className="w-full btn-primary mb-4"
        >
          <Plus className="w-5 h-5" />
          {t('أضف دين', 'Ajouter dette')}
        </button>
      )}

      {/* Debts List */}
      <div>
        <h3 className="font-bold mb-3">{t('الديون', 'Dettes')}</h3>
        {debts && debts.length > 0 ? (
          <div className="space-y-2">
            {debts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((debt) => (
                <div
                  key={debt.id}
                  className={`bg-card rounded-xl p-4 border ${
                    debt.isPaid ? 'border-success/30 bg-success/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold ${debt.isPaid ? 'text-success line-through' : ''}`}>
                        {debt.amount} {t('درهم', 'MAD')}
                      </p>
                      {debt.note && (
                        <p className="text-sm text-muted-foreground">{debt.note}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(debt.createdAt).toLocaleDateString(isArabic ? 'ar-MA' : 'fr-MA')}
                      </p>
                    </div>
                    {!debt.isPaid && (
                      <button
                        onClick={() => handleMarkPaid(debt.id)}
                        className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t('لا يوجد ديون', 'Pas de dettes')}
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerDetail;
