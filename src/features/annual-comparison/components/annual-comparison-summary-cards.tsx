import { Text, View } from 'react-native';

import { formatCurrency, formatMonthSummary } from '../annual-comparison.utils';
import { styles } from './styles/annual-comparison-summary-cards.styles';
import type { AnnualComparisonSummary } from '@/types';

type AnnualComparisonSummaryCardsProps = {
  summary: AnnualComparisonSummary | null;
};

export function AnnualComparisonSummaryCards({
  summary,
}: AnnualComparisonSummaryCardsProps) {
  if (!summary) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>No annual summary loaded yet</Text>
        <Text style={styles.emptyDescription}>
          Load one year to see totals, strongest months, and the comparison chart.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      <SummaryCard label="Accounts total" value={formatCurrency(summary.annualAccountsTotal)} />
      <SummaryCard label="Card bills total" value={formatCurrency(summary.annualCardBillsTotal)} />
      <SummaryCard label="Combined total" value={formatCurrency(summary.annualCombinedTotal)} />
      <SummaryCard label="Highest month" value={formatMonthSummary(summary.highestMonth)} />
      <SummaryCard label="Lowest month" value={formatMonthSummary(summary.lowestMonth)} fullWidth />
    </View>
  );
}

function SummaryCard({
  label,
  value,
  fullWidth = false,
}: {
  fullWidth?: boolean;
  label: string;
  value: string;
}) {
  return (
    <View style={[styles.card, fullWidth && styles.cardFullWidth]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}
