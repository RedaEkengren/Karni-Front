import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TransactionItem {
  id: string;
  transaction_id: string;
  item_name: string;
  price: number;
  created_at: string;
}

interface Transaction {
  id: string;
  client_id: string;
  user_id: string;
  total_amount: number;
  remaining_amount: number;
  is_paid: boolean;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: TransactionItem[];
  client_name?: string;
}

export const useTransactions = (clientId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions', user?.id, clientId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clientId) {
        query = query.eq('client_id', clientId);
      }

      const { data: transactionsData, error: transactionsError } = await query;

      if (transactionsError) throw transactionsError;

      // Fetch items for each transaction
      const transactionsWithItems = await Promise.all(
        (transactionsData || []).map(async (transaction) => {
          const { data: items } = await supabase
            .from('transaction_items')
            .select('*')
            .eq('transaction_id', transaction.id);

          // Fetch client name if not filtered by client
          let client_name = '';
          if (!clientId) {
            const { data: client } = await supabase
              .from('clients')
              .select('name')
              .eq('id', transaction.client_id)
              .single();
            client_name = client?.name || '';
          }

          // Calculate remaining amount (total_amount - paid_amount from partial payments)
          // For now, remaining_amount equals total_amount if not fully paid
          const remaining_amount = transaction.is_paid ? 0 : Number(transaction.total_amount);

          return {
            ...transaction,
            total_amount: Number(transaction.total_amount),
            remaining_amount,
            items: (items || []).map(item => ({
              ...item,
              price: Number(item.price)
            })),
            client_name,
          };
        })
      );

      return transactionsWithItems as Transaction[];
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async ({
                         clientId,
                         items,
                         notes,
                       }: {
      clientId: string;
      items: { item_name: string; price: number }[];
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          client_id: clientId,
          user_id: user.id,
          total_amount: totalAmount,
          notes: notes || null,
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create transaction items
      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(
          items.map((item) => ({
            transaction_id: transaction.id,
            item_name: item.item_name,
            price: item.price,
          }))
        );

      if (itemsError) throw itemsError;

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['totalDebt'] });
      toast.success('تمت إضافة الدين بنجاح');
    },
    onError: (error) => {
      console.error('Error adding transaction:', error);
      toast.error('حدث خطأ أثناء إضافة الدين');
    },
  });

  const markAsPaid = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from('transactions')
        .update({
          is_paid: true,
          paid_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['totalDebt'] });
      toast.success('تم تسجيل الدفع بنجاح');
    },
    onError: (error) => {
      console.error('Error marking as paid:', error);
      toast.error('حدث خطأ أثناء تسجيل الدفع');
    },
  });

  // FIFO Partial Payment - applies payment to oldest debts first
  const applyPartialPayment = useMutation({
    mutationFn: async (payments: { transactionId: string; amount: number }[]) => {
      if (!user) throw new Error('Not authenticated');

      for (const payment of payments) {
        // Get current transaction
        const { data: transaction, error: fetchError } = await supabase
          .from('transactions')
          .select('total_amount, is_paid')
          .eq('id', payment.transactionId)
          .single();

        if (fetchError) throw fetchError;

        const currentAmount = Number(transaction.total_amount);
        const newAmount = currentAmount - payment.amount;

        if (newAmount <= 0) {
          // Fully paid
          const { error: updateError } = await supabase
            .from('transactions')
            .update({
              total_amount: 0,
              is_paid: true,
              paid_at: new Date().toISOString(),
            })
            .eq('id', payment.transactionId);

          if (updateError) throw updateError;
        } else {
          // Partially paid - reduce total_amount
          const { error: updateError } = await supabase
            .from('transactions')
            .update({
              total_amount: newAmount,
            })
            .eq('id', payment.transactionId);

          if (updateError) throw updateError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['totalDebt'] });
      toast.success('تم تسجيل الدفعة بنجاح');
    },
    onError: (error) => {
      console.error('Error applying partial payment:', error);
      toast.error('حدث خطأ أثناء تسجيل الدفعة');
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['totalDebt'] });
      toast.success('تم حذف الدين');
    },
    onError: (error) => {
      console.error('Error deleting transaction:', error);
      toast.error('حدث خطأ أثناء حذف الدين');
    },
  });

  const unpaidTransactions = transactions.filter((t) => !t.is_paid);
  const paidTransactions = transactions.filter((t) => t.is_paid);

  return {
    transactions,
    unpaidTransactions,
    paidTransactions,
    isLoading,
    error,
    addTransaction,
    markAsPaid,
    applyPartialPayment,
    deleteTransaction,
  };
};

export const useTotalDebt = () => {
  const { user } = useAuth();

  const { data: totalDebt = 0, isLoading } = useQuery({
    queryKey: ['totalDebt', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data, error } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('user_id', user.id)
        .eq('is_paid', false);

      if (error) throw error;

      return (data || []).reduce((sum, t) => sum + Number(t.total_amount), 0);
    },
    enabled: !!user,
  });

  return { totalDebt, isLoading };
};
