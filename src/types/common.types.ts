export type DateString = string;

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export type FieldMessage = {
  fieldName: string;
  message: string;
};

export type StandardErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
};

export type ValidationErrorResponse = StandardErrorResponse & {
  errors: FieldMessage[];
};
