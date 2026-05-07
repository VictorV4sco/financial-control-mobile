export type AnnualComparisonMonthItem = {
  accountsTotal: number;
  cardBillsTotal: number;
  combinedTotal: number;
  label: string;
  month: number;
};

export type AnnualComparisonSummary = {
  annualAccountsTotal: number;
  annualCardBillsTotal: number;
  annualCombinedTotal: number;
  highestMonth: AnnualComparisonMonthItem;
  lowestMonth: AnnualComparisonMonthItem;
  months: AnnualComparisonMonthItem[];
  year: number;
};
