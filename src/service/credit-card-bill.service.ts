import { api } from './core';
import type { CreditCardBillInsertDTO, CreditCardBillReadDTO } from '@/types';

export async function createCreditCardBill(
  payload: CreditCardBillInsertDTO
): Promise<CreditCardBillReadDTO> {
  const response = await api.post<CreditCardBillReadDTO>('/credit-card-bill/insert', payload);
  return response.data;
}
