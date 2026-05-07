import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { formatCurrency } from '../../accounts-payable/accounts-payable.utils';
import { styles } from './styles/credit-card-bill-summary-card.styles';
import type { CreditCardBillReadDTO } from '@/types';

type CreditCardBillSummaryCardProps = {
  bill: CreditCardBillReadDTO | null;
  controls?: ReactNode;
  isViewingBill: boolean;
  onViewBill: () => void;
};

export function CreditCardBillSummaryCard({
  bill,
  controls,
  isViewingBill,
  onViewBill,
}: CreditCardBillSummaryCardProps) {
  return (
    <>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Bill details</Text>
        <Text style={styles.panelSubtitle}>
          Review the current bill details before adding transactions.
        </Text>
      </View>

      {controls}

      {bill ? (
        <>
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <InfoCard label="Bill ID" value={String(bill.id)} />
              <InfoCard label="Card ID" value={String(bill.creditCardId)} />
            </View>

            <View style={styles.infoRow}>
              <InfoCard label="Opening date" value={bill.openingDate} />
              <InfoCard label="Closing date" value={bill.closingDate} />
            </View>

            <View style={styles.infoRow}>
              <InfoCard label="Due date" value={bill.dueDate} />
              <InfoCard label="Status" value={bill.status} />
            </View>

            <View style={styles.infoRow}>
              <InfoCard label="Total amount" value={formatCurrency(bill.totalAmount)} />
            </View>
          </View>

          <Pressable
            onPress={onViewBill}
            disabled={isViewingBill}
            style={[styles.actionButton, isViewingBill && styles.actionButtonDisabled]}>
            <Text style={styles.actionButtonText}>
              {isViewingBill ? 'Loading bill...' : 'View bill'}
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No bill loaded yet</Text>
          <Text style={styles.emptyDescription}>
            Use the year and month above to load one bill for this credit card.
          </Text>
        </View>
      )}
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
