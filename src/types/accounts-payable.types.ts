import type { DateString, PaymentStatus } from './common.types';

export type AccountsPayableQueryParams = {
  month: number;
  year: number;
};

export type AccountsPayableInsertDTO = {
  id?: number | null;
  description: string;
  amount: number;
  dueDate: DateString;
  status?: PaymentStatus | null;
};

export type AccountsPayableReadDTO = {
  id: number;
  description: string;
  amount: number;
  dueDate: DateString;
  status: PaymentStatus;
};

export type AccountsPayableUpdateDTO = {
  id: number;
  description: string;
  amount: number;
  dueDate: DateString;
  status: PaymentStatus;
};
