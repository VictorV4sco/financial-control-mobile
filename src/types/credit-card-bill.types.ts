import type { DateString, PaymentStatus } from './common.types';

export type CreditCardBillQueryParams = {
  creditCardId: number;
  year: number;
  month: number;
};

export type CreditCardBillInsertDTO = {
  id?: number | null;
  creditCardId: number;
  year: number;
  month: number;
};

export type CreditCardBillReadDTO = {
  id: number;
  creditCardId: number;
  openingDate: DateString;
  closingDate: DateString;
  dueDate: DateString;
  totalAmount: number;
  status: PaymentStatus;
};

export type CreditCardBillUpdateDTO = {
  id: number;
  status: PaymentStatus;
};
