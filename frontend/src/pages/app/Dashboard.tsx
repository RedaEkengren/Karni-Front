import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/db';
import { Users, TrendingUp, Plus, ArrowLeft, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  // Live queries from IndexedDB
  const customers = useLiveQuery(
    () => db.customers.filter((c) => !c.deletedAt).toArray(),
    []
  );

  const debts = useLiveQuery(
    () => db.debts.filter((d) => !d.deletedAt).toArray(),
    []
  );

  const totalUnpaid = debts
    ?.filter((d) => !d.isPaid)
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0) || 0;

  const unpaidCount = debts?.filter((d) => !d.isPaid).length || 0;
  const customerCount = customers?.length || 0;

  // Recent activity (last 5 debts)
  const recentDebts = debts
    ?.filter((d) => !d.deletedAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {t(`مرحبا ${user?.name || ''}`, `Bonjour ${user?.name || ''}`)} 👋
        </h1>
        <p className="text-muted-foreground">
          {t('هذا ملخص نشاطك', 'Voici votre résumé')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">{t('إجمالي الديون', 'Total dettes')}</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {totalUnpaid.toLocaleString()} <span className="text-sm font-normal">{t('درهم', 'MAD')}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {unpaidCount} {t('دين غير مدفوع', 'impayées')}
          </p>
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{t('الزبائن', 'Clients')}</span>
          </div>
          <p className="text-2xl font-bold">
            {customerCount}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.isPremium
              ? t('بلا حدود', 'Illimité')
              : t(`${20 - customerCount} متبقي`, `${20 - customerCount} restants`)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/app/customers/add')}
          className="flex-1 btn-primary"
        >
          <Plus className="w-5 h-5" />
          {t('زبون جديد', 'Nouveau client')}
        </button>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">{t('آخر النشاط', 'Activité récente')}</h2>
          <button
            onClick={() => navigate('/app/customers')}
            className="text-sm text-primary flex items-center gap-1"
          >
            {t('عرض الكل', 'Voir tout')}
            <Arrow className="w-4 h-4" />
          </button>
        </div>

        {recentDebts && recentDebts.length > 0 ? (
          <div className="space-y-2">
            {recentDebts.map((debt) => {
              const customer = customers?.find((c) => c.id === debt.customerId);
              return (
                <div
                  key={debt.id}
                  className="bg-card rounded-xl p-3 border border-border flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{customer?.name || '—'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(debt.createdAt).toLocaleDateString(isArabic ? 'ar-MA' : 'fr-MA')}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className={`font-bold ${debt.isPaid ? 'text-success' : 'text-foreground'}`}>
                      {debt.isPaid ? t('مدفوع', 'Payé') : `${debt.amount - debt.paidAmount} ${t('درهم', 'MAD')}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>{t('لا يوجد نشاط بعد', 'Pas encore d\'activité')}</p>
            <button
              onClick={() => navigate('/app/customers/add')}
              className="text-primary mt-2"
            >
              {t('أضف أول زبون', 'Ajoutez votre premier client')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
