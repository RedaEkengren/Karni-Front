import { db, SyncAction } from '@/db';
import { syncApi } from './api';

let isSyncing = false;
let lastSyncTime: string | null = null;

export async function syncToServer(token: string): Promise<boolean> {
  if (!navigator.onLine || isSyncing) {
    return false;
  }

  isSyncing = true;

  try {
    // Get pending changes
    const pending = await db.syncQueue.toArray();

    if (pending.length === 0) {
      isSyncing = false;
      return true;
    }

    // Format changes for API
    const changes = pending.map((p: SyncAction) => ({
      action: p.action,
      table: p.table,
      local_id: p.localId,
      data: p.data,
      timestamp: p.timestamp,
    }));

    // Push to server
    const response = await syncApi.push(token, changes);

    // Update local records with server IDs
    for (const result of response.results) {
      if (result.status === 'created' || result.status === 'updated') {
        const table = pending.find(p => p.localId === result.local_id)?.table;

        if (table === 'customers') {
          await db.customers.update(result.local_id, {
            serverId: result.server_id,
            synced: true,
          });
        } else if (table === 'debts') {
          await db.debts.update(result.local_id, {
            serverId: result.server_id,
            synced: true,
          });
        }
      }
    }

    // Clear processed items from queue
    await db.syncQueue.clear();

    console.log(`Synced ${pending.length} changes to server`);
    return true;
  } catch (error) {
    console.error('Sync push failed:', error);
    return false;
  } finally {
    isSyncing = false;
  }
}

export async function pullFromServer(token: string): Promise<boolean> {
  if (!navigator.onLine) {
    return false;
  }

  try {
    const response = await syncApi.pull(token, lastSyncTime || undefined);

    // Update local customers
    for (const customer of response.customers as any[]) {
      const existing = await db.customers.where('serverId').equals(customer.id).first();

      if (existing) {
        // Update existing
        await db.customers.update(existing.id, {
          name: customer.name,
          phone: customer.phone,
          notes: customer.notes,
          deletedAt: customer.deleted_at,
          synced: true,
          updatedAt: customer.updated_at,
        });
      } else {
        // Create new (from server)
        await db.customers.add({
          id: customer.local_id || crypto.randomUUID(),
          serverId: customer.id,
          name: customer.name,
          phone: customer.phone,
          notes: customer.notes,
          synced: true,
          createdAt: customer.created_at,
          updatedAt: customer.updated_at,
          deletedAt: customer.deleted_at,
        });
      }
    }

    // Update local debts
    for (const debt of response.debts as any[]) {
      const existing = await db.debts.where('serverId').equals(debt.id).first();

      if (existing) {
        await db.debts.update(existing.id, {
          amount: debt.amount,
          paidAmount: debt.paid_amount || 0,
          note: debt.note,
          isPaid: debt.is_paid,
          paidAt: debt.paid_at,
          paidVia: debt.paid_via,
          deletedAt: debt.deleted_at,
          synced: true,
          updatedAt: debt.updated_at,
        });
      } else {
        // Find customer by server ID
        const customer = await db.customers.where('serverId').equals(debt.customer_id).first();

        if (customer) {
          await db.debts.add({
            id: debt.local_id || crypto.randomUUID(),
            serverId: debt.id,
            customerId: customer.id,
            amount: debt.amount,
            paidAmount: debt.paid_amount || 0,
            note: debt.note,
            isPaid: debt.is_paid,
            paidAt: debt.paid_at,
            paidVia: debt.paid_via,
            synced: true,
            createdAt: debt.created_at,
            updatedAt: debt.updated_at,
            deletedAt: debt.deleted_at,
          });
        }
      }
    }

    lastSyncTime = response.server_time;
    localStorage.setItem('rassidi-last-sync', lastSyncTime);

    console.log(`Pulled ${response.customers.length} customers, ${response.debts.length} debts from server`);
    return true;
  } catch (error) {
    console.error('Sync pull failed:', error);
    return false;
  }
}

export async function fullSync(token: string): Promise<boolean> {
  // Push first, then pull
  await syncToServer(token);
  return pullFromServer(token);
}

// Initialize last sync time from storage
export function initSync() {
  lastSyncTime = localStorage.getItem('rassidi-last-sync');
}

// Auto-sync when coming online
export function setupAutoSync(getToken: () => string | null) {
  window.addEventListener('online', async () => {
    const token = getToken();
    if (token) {
      console.log('Back online, syncing...');
      await fullSync(token);
    }
  });
}

export { isSyncing };
