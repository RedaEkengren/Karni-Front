import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  total_debt?: number;
}

export const useClients = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Fetch unpaid transactions for each client
      const clientsWithDebt = await Promise.all(
        (clientsData || []).map(async (client) => {
          const { data: transactions } = await supabase
            .from('transactions')
            .select('total_amount')
            .eq('client_id', client.id)
            .eq('is_paid', false);

          const total_debt = (transactions || []).reduce(
            (sum, t) => sum + Number(t.total_amount),
            0
          );

          return { ...client, total_debt };
        })
      );

      return clientsWithDebt as Client[];
    },
    enabled: !!user,
  });

  const addClient = useMutation({
    mutationFn: async ({ name, phone, notes }: { name: string; phone?: string; notes?: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name,
          phone: phone || null,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('تمت إضافة الزبون بنجاح');
    },
    onError: (error) => {
      console.error('Error adding client:', error);
      toast.error('حدث خطأ أثناء إضافة الزبون');
    },
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, name, phone, notes }: { id: string; name: string; phone?: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name,
          phone: phone || null,
          notes: notes || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('تم تحديث بيانات الزبون');
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات الزبون');
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('تم حذف الزبون');
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('حدث خطأ أثناء حذف الزبون');
    },
  });

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    clientCount: clients.length,
  };
};
