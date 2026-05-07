import { getAccountsPayableByMonthAndYear } from './accounts-payable.service';
import { getCreditCardBillByMonthAndYear } from './credit-card-bill.service';
import { getCreditCards } from './credit-card.service';
import { normalizeApiError } from './core/api-error';
import type {
  AnnualComparisonMonthItem,
  AnnualComparisonSummary,
  CreditCardReadDTO,
} from '@/types';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export async function getAnnualComparison(year: number): Promise<AnnualComparisonSummary> {
  const cards = await loadCreditCardsSafely();
  const months = await Promise.all(
    MONTH_LABELS.map((label, index) =>
      buildMonthlyComparison({
        cards,
        label,
        month: index + 1,
        year,
      })
    )
  );

  const annualAccountsTotal = months.reduce((sum, item) => sum + item.accountsTotal, 0);
  const annualCardBillsTotal = months.reduce((sum, item) => sum + item.cardBillsTotal, 0);
  const annualCombinedTotal = months.reduce((sum, item) => sum + item.combinedTotal, 0);
  const highestMonth = months.reduce((highest, item) =>
    item.combinedTotal > highest.combinedTotal ? item : highest
  );
  const monthsAboveZero = months.filter((item) => item.combinedTotal > 0);
  const lowestMonth =
    monthsAboveZero.length > 0
      ? monthsAboveZero.reduce((lowest, item) =>
          item.combinedTotal < lowest.combinedTotal ? item : lowest
        )
      : months[0];

  return {
    year,
    months,
    annualAccountsTotal,
    annualCardBillsTotal,
    annualCombinedTotal,
    highestMonth,
    lowestMonth,
  };
}

async function buildMonthlyComparison({
  cards,
  label,
  month,
  year,
}: {
  cards: CreditCardReadDTO[];
  label: string;
  month: number;
  year: number;
}): Promise<AnnualComparisonMonthItem> {
  const [accountsTotal, cardBillsTotal] = await Promise.all([
    getAccountsTotalForMonth(month, year),
    getCardBillsTotalForMonth(cards, month, year),
  ]);

  return {
    label,
    month,
    accountsTotal,
    cardBillsTotal,
    combinedTotal: accountsTotal + cardBillsTotal,
  };
}

async function getAccountsTotalForMonth(month: number, year: number): Promise<number> {
  try {
    const response = await getAccountsPayableByMonthAndYear({ month, year });
    return response.reduce((sum, item) => sum + item.amount, 0);
  } catch (error) {
    if (isNotFoundError(error)) {
      return 0;
    }

    throw error;
  }
}

async function getCardBillsTotalForMonth(
  cards: CreditCardReadDTO[],
  month: number,
  year: number
): Promise<number> {
  if (cards.length === 0) {
    return 0;
  }

  const totals = await Promise.all(
    cards.map(async (card) => {
      try {
        const bill = await getCreditCardBillByMonthAndYear({
          creditCardId: card.id,
          month,
          year,
        });

        return bill.totalAmount;
      } catch (error) {
        if (isNotFoundError(error)) {
          return 0;
        }

        throw error;
      }
    })
  );

  return totals.reduce((sum, value) => sum + value, 0);
}

async function loadCreditCardsSafely(): Promise<CreditCardReadDTO[]> {
  try {
    return await getCreditCards();
  } catch (error) {
    if (isNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}

function isNotFoundError(error: unknown): boolean {
  return normalizeApiError(error).status === 404;
}
