import { api } from './core';
import type {
  TransactionInsertDTO,
  TransactionQueryParams,
  TransactionReadDTO,
} from '@/types';

export async function getTransactionsByCreditCardBill(
  params: TransactionQueryParams
): Promise<TransactionReadDTO[]> {
  const response = await api.get<TransactionReadDTO[]>('/transaction', {
    params,
  });
  return response.data;
}

export async function createTransaction(
  payload: TransactionInsertDTO
): Promise<TransactionReadDTO> {
  const response = await api.post<TransactionReadDTO>('/transaction/insert', payload);
  return response.data;
}
