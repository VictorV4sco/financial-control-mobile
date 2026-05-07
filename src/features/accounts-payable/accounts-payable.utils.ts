import type { AccountsPayableReadDTO, PaymentStatus } from '@/types';

export type PieChartSlice = {
  color: string;
  endAngle: number;
  label: string;
  startAngle: number;
  value: number;
};

type StatusSummaryItem = {
  color: string;
  count: number;
  label: string;
  status: PaymentStatus;
  totalAmount: number;
};

const STATUS_COLORS: Record<PaymentStatus, string> = {
  PAID: '#0B6E4F',
  PENDING: '#F4A261',
  OVERDUE: '#D62828',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PAID: 'Paid',
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
};

export function buildPieChartSlices(items: AccountsPayableReadDTO[]): PieChartSlice[] {
  const statusSummary = buildStatusSummary(items);
  const totalAmount = statusSummary.reduce((sum, item) => sum + item.totalAmount, 0);

  if (totalAmount <= 0) {
    return [];
  }

  let currentAngle = -90;

  return statusSummary.map((item) => {
    const angle = (item.totalAmount / totalAmount) * 360;
    const slice = {
      label: item.label,
      value: item.totalAmount,
      color: item.color,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };

    currentAngle += angle;
    return slice;
  });
}

export function buildStatusSummary(items: AccountsPayableReadDTO[]): StatusSummaryItem[] {
  const grouped = items.reduce<Record<PaymentStatus, StatusSummaryItem>>(
    (accumulator, item) => {
      const currentStatus = accumulator[item.status];

      currentStatus.count += 1;
      currentStatus.totalAmount += item.amount;

      return accumulator;
    },
    {
      PAID: createStatusSummaryItem('PAID'),
      PENDING: createStatusSummaryItem('PENDING'),
      OVERDUE: createStatusSummaryItem('OVERDUE'),
    }
  );

  return Object.values(grouped).filter((item) => item.count > 0);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1;
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getStatusColor(status: PaymentStatus): string {
  return STATUS_COLORS[status];
}

export function getStatusLabel(status: PaymentStatus): string {
  return STATUS_LABELS[status];
}

function createStatusSummaryItem(status: PaymentStatus): StatusSummaryItem {
  return {
    status,
    label: STATUS_LABELS[status],
    color: STATUS_COLORS[status],
    count: 0,
    totalAmount: 0,
  };
}
