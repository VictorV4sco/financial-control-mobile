export type CreditCardInsertDTO = {
  id?: number | null;
  name: string;
  openingDay: number;
  closingDay: number;
  dueDay: number;
};

export type CreditCardReadDTO = {
  id: number;
  name: string;
  openingDay: number;
  closingDay: number;
  dueDay: number;
};

export type CreditCardUpdateDTO = {
  id: number;
  name: string;
  openingDay: number;
  closingDay: number;
  dueDay: number;
};
