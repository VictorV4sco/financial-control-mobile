import type { CreditCardInsertDTO, CreditCardReadDTO } from '@/types';

export type CreditCardFormState = {
  closingDay: string;
  dueDay: string;
  name: string;
  openingDay: string;
};

export const INITIAL_CREDIT_CARD_FORM_STATE: CreditCardFormState = {
  name: '',
  openingDay: '',
  closingDay: '',
  dueDay: '',
};

export function buildCreditCardPayload(
  formState: CreditCardFormState
): CreditCardInsertDTO | null {
  const normalizedName = formState.name.trim();
  const openingDay = parseDayValue(formState.openingDay);
  const closingDay = parseDayValue(formState.closingDay);
  const dueDay = parseDayValue(formState.dueDay);

  if (
    !normalizedName ||
    !openingDay ||
    !closingDay ||
    !dueDay ||
    openingDay < 1 ||
    openingDay > 31 ||
    closingDay < 1 ||
    closingDay > 31 ||
    dueDay < 1 ||
    dueDay > 31
  ) {
    return null;
  }

  return {
    name: normalizedName,
    openingDay,
    closingDay,
    dueDay,
  };
}

export function createFormStateFromCard(card: CreditCardReadDTO): CreditCardFormState {
  return {
    name: card.name,
    openingDay: String(card.openingDay),
    closingDay: String(card.closingDay),
    dueDay: String(card.dueDay),
  };
}

export function sanitizeDayInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 2);
}

function parseDayValue(value: string): number {
  return Number.parseInt(value.replace(/\D/g, ''), 10);
}
