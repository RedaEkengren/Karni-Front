import Dexie, { Table } from 'dexie';

// Types
export interface User {
  id: string;
  phone: string;
  name: string;
  language: 'ar' | 'fr';
  isPremium: boolean;
  token: string;
}

export interface Customer {
  id: string;
  serverId?: string;
  name: string;
  phone?: string;
  notes?: string;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Debt {
  id: string;
  serverId?: string;
  customerId: string;
  amount: number;
  paidAmount: number;
  note?: string;
  isPaid: boolean;
  paidAt?: string;
  paidVia?: 'customer' | 'sadaqa' | 'partial';
  synced: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface SyncAction {
  id?: number;
  action: 'create' | 'update' | 'delete';
  table: 'customers' | 'debts';
  localId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Database class
export class SmartKarniDB extends Dexie {
  user!: Table<User>;
  customers!: Table<Customer>;
  debts!: Table<Debt>;
  syncQueue!: Table<SyncAction>;
  chatMessages!: Table<ChatMessage>;

  constructor() {
    super('smartkarni');

    this.version(1).stores({
      user: 'id, phone',
      customers: 'id, serverId, name, phone, synced, deletedAt',
      debts: 'id, serverId, customerId, isPaid, synced, deletedAt',
      syncQueue: '++id, action, table, localId, timestamp',
      chatMessages: '++id, role, timestamp',
    });
  }
}

// Singleton instance
export const db = new SmartKarniDB();

// Helper functions
export async function clearAllData() {
  await db.user.clear();
  await db.customers.clear();
  await db.debts.clear();
  await db.syncQueue.clear();
  await db.chatMessages.clear();
}

export async function getActiveCustomers() {
  return db.customers.filter(c => !c.deletedAt).toArray();
}

export async function getCustomerDebts(customerId: string) {
  return db.debts.filter(d => d.customerId === customerId && !d.deletedAt).toArray();
}

export async function getUnpaidDebts() {
  return db.debts.filter(d => !d.isPaid && !d.deletedAt).toArray();
}

export async function getTotalUnpaid() {
  const debts = await getUnpaidDebts();
  return debts.reduce((sum, d) => sum + (d.amount - d.paidAmount), 0);
}
