export type CreditCardInsertDTO = {
  id?: number | null;
  name: string;
};

export type CreditCardReadDTO = {
  id: number;
  name: string;
};

export type CreditCardUpdateDTO = {
  id: number;
  name: string;
};
