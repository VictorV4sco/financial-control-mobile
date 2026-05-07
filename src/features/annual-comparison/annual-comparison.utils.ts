import { formatCurrency, getCurrentYear } from '../accounts-payable/accounts-payable.utils';
import type { AnnualComparisonMonthItem } from '@/types';

export { formatCurrency, getCurrentYear };

export const ACCOUNTS_COLOR = '#D97706';
export const CARD_BILLS_COLOR = '#1D4ED8';

export function formatMonthSummary(item: AnnualComparisonMonthItem): string {
  return `${item.label} - ${formatCurrency(item.combinedTotal)}`;
}

export function sanitizeYearInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}
