export const FREE_PLAN_LIMITS = {
  MAX_CLIENTS: 20,
  MAX_ITEMS_PER_CLIENT: 100,
} as const;

export const CURRENCY = {
  symbol: 'د.م.',
  code: 'MAD',
} as const;

export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} ${CURRENCY.symbol}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ar-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
