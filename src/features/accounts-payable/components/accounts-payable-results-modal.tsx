import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AccountsPayablePieChart from './accounts-payable-pie-chart';
import {
  buildPieChartSlices,
  buildStatusSummary,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
} from '../accounts-payable.utils';
import type { AccountsPayableReadDTO } from '@/types';

type AccountsPayableResultsModalProps = {
  isDeletingId: number | null;
  month: number;
  onClose: () => void;
  onDelete: (record: AccountsPayableReadDTO) => void;
  onEdit: (record: AccountsPayableReadDTO) => void;
  records: AccountsPayableReadDTO[];
  visible: boolean;
  year: number;
};

export function AccountsPayableResultsModal({
  visible,
  onClose,
  records,
  month,
  year,
  onEdit,
  onDelete,
  isDeletingId,
}: AccountsPayableResultsModalProps) {
  const pieChartSlices = buildPieChartSlices(records);
  const statusSummary = buildStatusSummary(records);
  const totalAmount = records.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Monthly cost summary</Text>
              <Text style={styles.title}>
                {String(month).padStart(2, '0')}/{year}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.chartCard}>
              <AccountsPayablePieChart slices={pieChartSlices} />
              <View style={styles.chartSummary}>
                <Text style={styles.chartSummaryLabel}>Total amount</Text>
                <Text style={styles.chartSummaryValue}>{formatCurrency(totalAmount)}</Text>
              </View>
            </View>

            <View style={styles.statusSummaryRow}>
              {statusSummary.map((item) => (
                <View key={item.status} style={styles.statusCard}>
                  <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                  <Text style={styles.statusLabel}>{item.label}</Text>
                  <Text style={styles.statusValue}>{item.count} items</Text>
                  <Text style={styles.statusAmount}>{formatCurrency(item.totalAmount)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.legendCard}>
              <Text style={styles.legendTitle}>Bills for the selected month</Text>
              {records.map((item) => (
                <View key={item.id} style={styles.recordCard}>
                  <View style={styles.recordTopRow}>
                    <View style={styles.legendLeft}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: getStatusColor(item.status) },
                        ]}
                      />
                      <View>
                        <Text style={styles.legendLabel}>{item.description}</Text>
                        <Text style={styles.legendMeta}>
                          {getStatusLabel(item.status)} • due {item.dueDate}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.legendAmount}>{formatCurrency(item.amount)}</Text>
                  </View>

                  <View style={styles.recordActions}>
                    <Pressable onPress={() => onEdit(item)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => onDelete(item)}
                      disabled={isDeletingId === item.id}
                      style={[
                        styles.deleteButton,
                        isDeletingId === item.id && styles.disabledActionButton,
                      ]}>
                      <Text style={styles.deleteButtonText}>
                        {isDeletingId === item.id ? 'Deleting...' : 'Delete'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 13, 25, 0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: '#F6F8FB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: '#51606F',
  },
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    gap: 18,
    paddingBottom: 12,
  },
  chartCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    alignItems: 'center',
    gap: 16,
  },
  chartSummary: {
    alignItems: 'center',
    gap: 4,
  },
  chartSummaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#51606F',
  },
  chartSummaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    minWidth: '31%',
    flexGrow: 1,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 6,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusValue: {
    fontSize: 13,
    color: '#51606F',
  },
  statusAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    gap: 16,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 14,
  },
  recordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  legendLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#51606F',
  },
  legendAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledActionButton: {
    opacity: 0.7,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B91C1C',
  },
});
