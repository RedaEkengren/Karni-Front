import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/hooks/useClients';
import { useTotalDebt } from '@/hooks/useTransactions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Users, 
  Plus, 
  TrendingUp, 
  Wallet,
  ChevronLeft,
  Crown,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, FREE_PLAN_LIMITS } from '@/lib/constants';
import { ClientCard } from '@/components/ClientCard';
import { AddClientModal } from '@/components/AddClientModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { clients, isLoading: clientsLoading, addClient, clientCount } = useClients();
  const { totalDebt, isLoading: debtLoading } = useTotalDebt();
  
  const [showAddClient, setShowAddClient] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPremium = profile?.is_premium ?? false;
  const recentClients = clients.slice(0, 3);
  const canAddClient = isPremium || clientCount < FREE_PLAN_LIMITS.MAX_CLIENTS;

  const handleAddClient = async (data: { name: string; phone?: string; notes?: string }) => {
    await addClient.mutateAsync(data);
  };

  const handleQuickAdd = () => {
    if (!canAddClient) {
      setShowUpgrade(true);
      return;
    }
    setShowAddClient(true);
  };

  return (
    <div className="py-4 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            مرحباً، {profile?.full_name || 'صاحب المتجر'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            إليك ملخص ديون متجرك
          </p>
        </div>
        {!isPremium && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUpgrade(true)}
            className="text-accent border-accent/30 hover:bg-accent/10"
          >
            <Crown className="w-4 h-4 ml-1" />
            ترقية
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Debt */}
        <Card className="col-span-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 moroccan-pattern opacity-10" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
                  <Wallet className="w-4 h-4" />
                  إجمالي الديون
                </p>
                {debtLoading ? (
                  <Skeleton className="h-10 w-32 mt-2 bg-primary-foreground/20" />
                ) : (
                  <p className="text-3xl font-bold mt-2 currency">{formatCurrency(totalDebt)}</p>
                )}
              </div>
              <div className="w-16 h-16 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                <CreditCard className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Count */}
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">العملاء</p>
                {clientsLoading ? (
                  <Skeleton className="h-6 w-10 mt-1" />
                ) : (
                  <p className="text-xl font-bold">{clientCount}</p>
                )}
              </div>
            </div>
            {!isPremium && (
              <p className="text-xs text-muted-foreground mt-2">
                {clientCount}/{FREE_PLAN_LIMITS.MAX_CLIENTS} في الخطة المجانية
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Add Button */}
        <Card 
          className="card-hover cursor-pointer border-dashed border-2 border-primary/30 bg-primary/5"
          onClick={handleQuickAdd}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary">إضافة سريعة</p>
          </CardContent>
        </Card>
      </div>

      {/* Free Plan Warning */}
      {!isPremium && clientCount >= FREE_PLAN_LIMITS.MAX_CLIENTS - 2 && (
        <Card className="bg-warning/10 border-warning/30">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                أنت قريب من الحد الأقصى للعملاء
              </p>
              <p className="text-xs text-muted-foreground">
                يتبقى لك {FREE_PLAN_LIMITS.MAX_CLIENTS - clientCount} عميل فقط في الخطة المجانية
              </p>
            </div>
            <Button size="sm" className="btn-gold" onClick={() => setShowUpgrade(true)}>
              ترقية
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Clients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            آخر العملاء
          </h2>
          <Link to="/clients">
            <Button variant="ghost" size="sm" className="text-primary">
              عرض الكل
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          </Link>
        </div>

        {clientsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentClients.length > 0 ? (
          <div className="space-y-3">
            {recentClients.map((client, index) => (
              <div key={client.id} className="stagger-item">
                <ClientCard
                  id={client.id}
                  name={client.name}
                  phone={client.phone}
                  totalDebt={client.total_debt || 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">لا يوجد عملاء بعد</p>
              <Button className="mt-4 btn-gradient" onClick={handleQuickAdd}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة أول عميل
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <AddClientModal
        open={showAddClient}
        onOpenChange={setShowAddClient}
        onSubmit={handleAddClient}
      />
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        reason="clients"
      />
    </div>
  );
};

export default Dashboard;
