import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import AccountsPayablePieChart from './accounts-payable-pie-chart';
import { styles } from './styles/accounts-payable-results-modal.styles';
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
