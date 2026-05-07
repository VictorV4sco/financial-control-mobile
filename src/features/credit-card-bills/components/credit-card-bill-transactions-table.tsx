import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { formatCurrency } from '../../accounts-payable/accounts-payable.utils';
import { styles } from './styles/credit-card-bill-transactions-table.styles';
import type { TransactionReadDTO } from '@/types';

type CreditCardBillTransactionsTableProps = {
  onOpenDetails: (transaction: TransactionReadDTO) => void;
  transactions: TransactionReadDTO[];
};

export function CreditCardBillTransactionsTable({
  transactions,
  onOpenDetails,
}: CreditCardBillTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>No transactions yet</Text>
        <Text style={styles.emptyDescription}>
          This bill does not have any saved transactions yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tableCard}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.columnName]}>Name</Text>
        <Text style={[styles.headerCell, styles.columnDate]}>Date</Text>
        <Text style={[styles.headerCell, styles.columnPrice]}>Price</Text>
        <Text style={[styles.headerCell, styles.columnDetailsHeader]}>Info</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.row}>
            <Text style={[styles.cellText, styles.columnName]} numberOfLines={1}>
              {transaction.name}
            </Text>
            <Text style={[styles.cellText, styles.columnDate]} numberOfLines={1}>
              {transaction.date}
            </Text>
            <Text style={[styles.cellText, styles.columnPrice]} numberOfLines={1}>
              {formatCurrency(transaction.price)}
            </Text>
            <View style={styles.columnDetails}>
              <Pressable
                onPress={() => onOpenDetails(transaction)}
                style={({ pressed }) => [styles.detailsButton, pressed && styles.detailsButtonPressed]}>
                <Ionicons name="information-circle-outline" size={18} color="#0F172A" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
