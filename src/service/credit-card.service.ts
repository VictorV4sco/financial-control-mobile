import { api } from './core';
import type { CreditCardInsertDTO, CreditCardReadDTO, CreditCardUpdateDTO } from '@/types';

export async function getCreditCards(): Promise<CreditCardReadDTO[]> {
  const response = await api.get<CreditCardReadDTO[]>('/credit-card');
  return response.data;
}

export async function createCreditCard(
  payload: CreditCardInsertDTO
): Promise<CreditCardReadDTO> {
  const response = await api.post<CreditCardReadDTO>('/credit-card/insert', payload);
  return response.data;
}

export async function updateCreditCard(
  id: number,
  payload: CreditCardUpdateDTO
): Promise<CreditCardUpdateDTO> {
  const response = await api.put<CreditCardUpdateDTO>(`/credit-card/update/${id}`, payload);
  return response.data;
}

export async function deleteCreditCard(id: number): Promise<void> {
  await api.delete(`/credit-card/delete/${id}`);
}
