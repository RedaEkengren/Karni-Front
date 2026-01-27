import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  Plus,
  User,
  Phone,
  Wallet,
  History,
  FileText,
  Trash2,
  Banknote,
  Loader2
} from 'lucide-react';
import { formatCurrency, FREE_PLAN_LIMITS } from '@/lib/constants';
import { TransactionCard } from '@/components/TransactionCard';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { PartialPaymentModal } from '@/components/PartialPaymentModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';

const ClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const { deleteClient } = useClients();
  const {
    unpaidTransactions,
    paidTransactions,
    isLoading: transactionsLoading,
    addTransaction,
    markAsPaid,
    applyPartialPayment,
    deleteTransaction,
  } = useTransactions(id);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showPartialPayment, setShowPartialPayment] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Fetch client details
  const { data: client, isLoading: clientLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const isPremium = profile?.is_premium ?? false;

  const totalDebt = useMemo(() => {
    return unpaidTransactions.reduce((sum, t) => sum + t.total_amount, 0);
  }, [unpaidTransactions]);

  const currentItemCount = useMemo(() => {
    return [...unpaidTransactions, ...paidTransactions].reduce(
      (sum, t) => sum + (t.items?.length || 0),
      0
    );
  }, [unpaidTransactions, paidTransactions]);

  const handleAddTransaction = async (data: {
    clientId: string;
    items: { item_name: string; price: number }[];
    notes?: string;
  }) => {
    await addTransaction.mutateAsync(data);
  };

  const handleMarkAsPaid = (transactionId: string) => {
    markAsPaid.mutate(transactionId);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction.mutate(transactionId);
  };

  const handlePartialPayment = async (
    payments: { transactionId: string; amount: number }[]
  ) => {
    await applyPartialPayment.mutateAsync(payments);
  };

  const handleDeleteClient = async () => {
    if (!id) return;
    try {
      await deleteClient.mutateAsync(id);
      navigate('/clients');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الزبون');
    }
  };

  if (clientLoading) {
    return (
      <div className="py-4 space-y-4" dir="rtl">
        <Skeleton className="h-8 w-32" />
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-4 text-center" dir="rtl">
        <p className="text-muted-foreground">الزبون غير موجود</p>
        <Link to="/clients">
          <Button variant="outline" className="mt-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للعملاء
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/clients')}
          className="flex-shrink-0"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
          {client.phone && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span dir="ltr">{client.phone}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive border-destructive/30">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>حذف الزبون</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف الزبون "{client.name}"؟ سيتم حذف جميع الديون المرتبطة به.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteClient}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  حذف
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Client Stats */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                الرصيد المستحق
              </p>
              <p className="text-2xl font-bold mt-1 currency">{formatCurrency(totalDebt)}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowAddTransaction(true)}
          className="flex-1 btn-gradient py-6"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة دين جديد
        </Button>
        {unpaidTransactions.length > 0 && (
          <Button
            onClick={() => setShowPartialPayment(true)}
            variant="outline"
            className="py-6 border-primary text-primary hover:bg-primary/10"
          >
            <Banknote className="w-5 h-5 ml-2" />
            تسجيل دفعة
          </Button>
        )}
      </div>

      {/* Transactions Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'history')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            الديون النشطة
            {unpaidTransactions.length > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs px-1.5 rounded-full">
                {unpaidTransactions.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <History className="w-4 h-4" />
            السجل
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : unpaidTransactions.length > 0 ? (
            unpaidTransactions.map((transaction, index) => (
              <div key={transaction.id} className="stagger-item">
                <TransactionCard
                  id={transaction.id}
                  totalAmount={transaction.total_amount}
                  isPaid={false}
                  notes={transaction.notes}
                  createdAt={transaction.created_at}
                  items={transaction.items}
                  onMarkAsPaid={handleMarkAsPaid}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            ))
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="p-8 text-center">
                <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">لا توجد ديون نشطة</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {transactionsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : paidTransactions.length > 0 ? (
            paidTransactions.map((transaction, index) => (
              <div key={transaction.id} className="stagger-item">
                <TransactionCard
                  id={transaction.id}
                  totalAmount={transaction.total_amount}
                  isPaid={true}
                  notes={transaction.notes}
                  createdAt={transaction.created_at}
                  paidAt={transaction.paid_at}
                  items={transaction.items}
                />
              </div>
            ))
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="p-8 text-center">
                <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">لا يوجد سجل سابق</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddTransactionModal
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
        clientId={id!}
        clientName={client.name}
        currentItemCount={currentItemCount}
        onSubmit={handleAddTransaction}
        onUpgradeNeeded={() => setShowUpgrade(true)}
      />
      <PartialPaymentModal
        isOpen={showPartialPayment}
        onClose={() => setShowPartialPayment(false)}
        transactions={unpaidTransactions.map((t) => ({
          id: t.id,
          total_amount: t.total_amount,
          remaining_amount: t.total_amount,
          created_at: t.created_at,
        }))}
        onPayment={handlePartialPayment}
        clientName={client.name}
      />
      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        reason="items"
      />
    </div>
  );
};

export default ClientDetail;
