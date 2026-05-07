import { api } from './core';
import type {
  CreditCardBillInsertDTO,
  CreditCardBillQueryParams,
  CreditCardBillReadDTO,
  CreditCardBillUpdateDTO,
} from '@/types';

export async function getCreditCardBillByMonthAndYear(
  params: CreditCardBillQueryParams
): Promise<CreditCardBillReadDTO> {
  const response = await api.get<CreditCardBillReadDTO>('/credit-card-bill', {
    params,
  });
  return response.data;
}

export async function createCreditCardBill(
  payload: CreditCardBillInsertDTO
): Promise<CreditCardBillReadDTO> {
  const response = await api.post<CreditCardBillReadDTO>('/credit-card-bill/insert', payload);
  return response.data;
}

export async function updateCreditCardBill(
  id: number,
  payload: CreditCardBillUpdateDTO
): Promise<CreditCardBillUpdateDTO> {
  const response = await api.put<CreditCardBillUpdateDTO>(`/credit-card-bill/update/${id}`, payload);
  return response.data;
}
