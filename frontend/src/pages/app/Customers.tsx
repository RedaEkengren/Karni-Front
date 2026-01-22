import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/db';
import { Plus, Search, User, ChevronRight, ChevronLeft } from 'lucide-react';

const Customers = () => {
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const Chevron = isArabic ? ChevronLeft : ChevronRight;

  const [search, setSearch] = useState('');

  // Live query from IndexedDB
  const customers = useLiveQuery(
    () => db.customers.filter((c) => !c.deletedAt).toArray(),
    []
  );

  const debts = useLiveQuery(
    () => db.debts.filter((d) => !d.deletedAt && !d.isPaid).toArray(),
    []
  );

  // Calculate debt totals per customer
  const customersWithDebt = customers?.map((customer) => {
    const customerDebts = debts?.filter((d) => d.customerId === customer.id) || [];
    const totalDebt = customerDebts.reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);
    return { ...customer, totalDebt, debtCount: customerDebts.length };
  });

  // Filter by search
  const filtered = customersWithDebt?.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  // Sort by debt (highest first)
  const sorted = filtered?.sort((a, b) => b.totalDebt - a.totalDebt);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('الزبائن', 'Clients')}</h1>
        <button
          onClick={() => navigate('/app/customers/add')}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('إضافة', 'Ajouter')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('البحث عن زبون...', 'Rechercher un client...')}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Customer List */}
      {sorted && sorted.length > 0 ? (
        <div className="space-y-2">
          {sorted.map((customer) => (
            <button
              key={customer.id}
              onClick={() => navigate(`/app/customers/${customer.id}`)}
              className="w-full bg-card rounded-xl p-4 border border-border flex items-center gap-3 hover:border-primary transition-colors text-start"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{customer.name}</p>
                {customer.phone && (
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {customer.phone}
                  </p>
                )}
              </div>
              <div className="text-end flex-shrink-0">
                {customer.totalDebt > 0 ? (
                  <>
                    <p className="font-bold text-primary">
                      {customer.totalDebt.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {customer.debtCount} {t('دين', 'dette(s)')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-success">{t('خالص', 'Soldé')}</p>
                )}
              </div>
              <Chevron className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">
            {search
              ? t('لا يوجد نتائج', 'Aucun résultat')
              : t('لا يوجد زبائن بعد', 'Pas encore de clients')}
          </p>
          {!search && (
            <button
              onClick={() => navigate('/app/customers/add')}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              {t('أضف أول زبون', 'Ajouter votre premier client')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Customers;
