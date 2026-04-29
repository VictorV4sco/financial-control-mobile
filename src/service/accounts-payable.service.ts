import { api } from './core';
import type {
  AccountsPayableInsertDTO,
  AccountsPayableQueryParams,
  AccountsPayableReadDTO,
  AccountsPayableUpdateDTO,
} from '@/types';

export async function getAccountsPayableByMonthAndYear(
  params: AccountsPayableQueryParams
): Promise<AccountsPayableReadDTO[]> {
  const response = await api.get<AccountsPayableReadDTO[]>('/accounts-payable', {
    params,
  });

  return response.data;
}

export async function createAccountsPayable(
  payload: AccountsPayableInsertDTO
): Promise<AccountsPayableInsertDTO> {
  const response = await api.post<AccountsPayableInsertDTO>('/accounts-payable/insert', payload);

  return response.data;
}

export async function updateAccountsPayable(
  id: number,
  payload: AccountsPayableInsertDTO
): Promise<AccountsPayableUpdateDTO> {
  const response = await api.put<AccountsPayableUpdateDTO>(`/accounts-payable/update/${id}`, payload);

  return response.data;
}

export async function deleteAccountsPayable(id: number): Promise<void> {
  await api.delete(`/accounts-payable/delete/${id}`);
}
