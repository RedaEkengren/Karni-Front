import React, { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, FileText, History, AlertCircle } from 'lucide-react';
import { TransactionCard } from '@/components/TransactionCard';
import { Skeleton } from '@/components/ui/skeleton';

const Transactions: React.FC = () => {
  const {
    unpaidTransactions,
    paidTransactions,
    isLoading,
    markAsPaid,
    deleteTransaction,
  } = useTransactions();
  
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const handleMarkAsPaid = (transactionId: string) => {
    markAsPaid.mutate(transactionId);
  };

  const handleDelete = (transactionId: string) => {
    deleteTransaction.mutate(transactionId);
  };

  return (
    <div className="py-4 space-y-4" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Receipt className="w-6 h-6 text-primary" />
          الديون
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {unpaidTransactions.length} ديون نشطة
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'history')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            نشطة
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-24 w-full" />
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
                  clientName={transaction.client_name}
                  showClientName={true}
                  onMarkAsPaid={handleMarkAsPaid}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <Receipt className="w-8 h-8 text-success" />
                </div>
                <p className="text-lg font-medium text-success">ممتاز!</p>
                <p className="text-muted-foreground mt-1">لا توجد ديون نشطة حالياً</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-24 w-full" />
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
                  clientName={transaction.client_name}
                  showClientName={true}
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
    </div>
  );
};

export default Transactions;
