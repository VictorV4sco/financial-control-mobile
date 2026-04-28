import type { DateString } from './common.types';

export type TransactionQueryParams = {
  creditCardBillId: number;
};

export type TransactionInsertDTO = {
  id?: number | null;
  creditCardBillId: number;
  name: string;
  description: string | null;
  date: DateString;
  installmentPurchase: boolean;
  installmentCount: number;
  price: number;
};

export type TransactionReadDTO = {
  id: number;
  creditCardBillId: number;
  name: string;
  description: string | null;
  date: DateString;
  installmentPurchase: boolean;
  installmentCount: number;
  price: number;
  installmentPrice: number;
  installmentNumber: number;
};

export type TransactionUpdateDTO = {
  id: number;
  creditCardBillId: number;
  name: string;
  description: string | null;
  date: DateString;
  installmentPurchase: boolean;
  installmentCount: number;
  price: number;
  installmentPrice: number;
  installmentNumber: number;
};
