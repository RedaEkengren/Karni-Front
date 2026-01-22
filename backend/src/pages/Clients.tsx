import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/hooks/useClients';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Users, UserX } from 'lucide-react';
import { ClientCard } from '@/components/ClientCard';
import { AddClientModal } from '@/components/AddClientModal';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Skeleton } from '@/components/ui/skeleton';
import { FREE_PLAN_LIMITS } from '@/lib/constants';

const Clients: React.FC = () => {
  const { profile } = useAuth();
  const { clients, isLoading, addClient, clientCount } = useClients();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const isPremium = profile?.is_premium ?? false;
  const canAddClient = isPremium || clientCount < FREE_PLAN_LIMITS.MAX_CLIENTS;

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        (client.phone && client.phone.includes(query))
    );
  }, [clients, searchQuery]);

  const handleAddClient = async (data: { name: string; phone?: string; notes?: string }) => {
    await addClient.mutateAsync(data);
  };

  const handleAddClick = () => {
    if (!canAddClient) {
      setShowUpgrade(true);
      return;
    }
    setShowAddClient(true);
  };

  return (
    <div className="py-4 space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            العملاء
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {clientCount} عميل
            {!isPremium && ` / ${FREE_PLAN_LIMITS.MAX_CLIENTS}`}
          </p>
        </div>
        <Button onClick={handleAddClick} className="btn-gradient">
          <Plus className="w-4 h-4 ml-1" />
          إضافة
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="البحث عن عميل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Clients List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
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
      ) : filteredClients.length > 0 ? (
        <div className="space-y-3">
          {filteredClients.map((client, index) => (
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
      ) : searchQuery ? (
        <Card className="bg-muted/30">
          <CardContent className="p-8 text-center">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لم يتم العثور على عملاء بهذا الاسم</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              مسح البحث
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">لا يوجد عملاء بعد</p>
            <Button className="mt-4 btn-gradient" onClick={handleAddClick}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة أول عميل
            </Button>
          </CardContent>
        </Card>
      )}

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

export default Clients;
