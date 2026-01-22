const API_BASE = '/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(error || 'Request failed', response.status);
  }

  return response.json();
}

// Auth endpoints
export const authApi = {
  requestOtp: (phone: string) =>
    request<{ success: boolean }>('/auth/request-otp', {
      method: 'POST',
      body: { phone },
    }),

  verifyOtp: (phone: string, code: string) =>
    request<{ token: string; user: { id: string; phone: string; name: string; language: 'ar' | 'fr'; is_premium: boolean } }>('/auth/verify-otp', {
      method: 'POST',
      body: { phone, code },
    }),

  updateProfile: (token: string, data: { name?: string; language?: 'ar' | 'fr' }) =>
    request<{ success: boolean }>('/auth/profile', {
      method: 'PUT',
      body: data,
      token,
    }),
};

// Customers endpoints
export const customersApi = {
  list: (token: string) =>
    request<{ customers: Array<{ id: string; name: string; phone?: string; notes?: string; total_debt: number; unpaid_count: number }> }>('/customers', { token }),

  get: (token: string, id: string) =>
    request<{ customer: unknown; debts: unknown[] }>(`/customers/${id}`, { token }),

  create: (token: string, data: { name: string; phone?: string; notes?: string }) =>
    request<{ id: string }>('/customers', {
      method: 'POST',
      body: data,
      token,
    }),

  update: (token: string, id: string, data: { name?: string; phone?: string; notes?: string }) =>
    request<{ success: boolean }>(`/customers/${id}`, {
      method: 'PUT',
      body: data,
      token,
    }),

  delete: (token: string, id: string) =>
    request<{ success: boolean }>(`/customers/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Debts endpoints
export const debtsApi = {
  list: (token: string, status?: 'paid' | 'unpaid' | 'all') =>
    request<{ debts: unknown[] }>(`/debts${status ? `?status=${status}` : ''}`, { token }),

  create: (token: string, data: { customer_id: string; amount: number; note?: string }) =>
    request<{ id: string }>('/debts', {
      method: 'POST',
      body: data,
      token,
    }),

  update: (token: string, id: string, data: { amount?: number; note?: string; is_paid?: boolean }) =>
    request<{ success: boolean }>(`/debts/${id}`, {
      method: 'PUT',
      body: data,
      token,
    }),

  pay: (token: string, id: string, amount: number) =>
    request<{ success: boolean; remaining: number }>(`/debts/${id}/pay`, {
      method: 'POST',
      body: { amount },
      token,
    }),

  delete: (token: string, id: string) =>
    request<{ success: boolean }>(`/debts/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// Sync endpoints
export const syncApi = {
  push: (token: string, changes: Array<{ action: string; table: string; local_id: string; data?: unknown; timestamp: string }>) =>
    request<{ results: Array<{ local_id: string; server_id: string; status: string }> }>('/sync/push', {
      method: 'POST',
      body: { changes },
      token,
    }),

  pull: (token: string, since?: string) =>
    request<{ customers: unknown[]; debts: unknown[]; server_time: string }>(`/sync/pull${since ? `?since=${since}` : ''}`, { token }),
};

// Chat endpoints
export const chatApi = {
  send: (token: string, message: string) =>
    request<{ response: string }>('/chat', {
      method: 'POST',
      body: { message },
      token,
    }),

  history: (token: string) =>
    request<{ messages: Array<{ role: string; content: string; created_at: string }> }>('/chat/history', { token }),
};

// Sadaqa endpoints
export const sadaqaApi = {
  queue: (token: string) =>
    request<{ count: number; total_amount: number }>('/sadaqa/queue', { token }),

  donate: (token: string, amount: number, anonymous = true) =>
    request<{ success: boolean; debts_paid: number }>('/sadaqa/donate', {
      method: 'POST',
      body: { amount, anonymous },
      token,
    }),

  history: (token: string) =>
    request<{ donations: unknown[] }>('/sadaqa/history', { token }),
};

export { ApiError };
