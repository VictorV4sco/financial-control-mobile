import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { formatCurrency } from '../../accounts-payable/accounts-payable.utils';
import { styles } from './styles/credit-card-bill-transaction-details-modal.styles';
import type { TransactionReadDTO } from '@/types';

type CreditCardBillTransactionDetailsModalProps = {
  onClose: () => void;
  transaction: TransactionReadDTO | null;
  visible: boolean;
};

export function CreditCardBillTransactionDetailsModal({
  visible,
  onClose,
  transaction,
}: CreditCardBillTransactionDetailsModalProps) {
  if (!transaction) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={styles.backdrop} />

        <View style={styles.modalCard}>
          <View style={styles.header}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.eyebrow}>Transaction details</Text>
              <Text style={styles.title}>{transaction.name}</Text>
            </View>

            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.infoGrid}>
              <InfoCard label="Transaction ID" value={String(transaction.id)} />
              <InfoCard label="Bill ID" value={String(transaction.creditCardBillId)} />
              <InfoCard label="Date" value={transaction.date} />
              <InfoCard label="Price" value={formatCurrency(transaction.price)} />
              <InfoCard
                label="Installment purchase"
                value={transaction.installmentPurchase ? 'Yes' : 'No'}
              />
              <InfoCard label="Installment count" value={String(transaction.installmentCount)} />
              <InfoCard label="Installment number" value={String(transaction.installmentNumber)} />
              <InfoCard
                label="Installment price"
                value={formatCurrency(transaction.installmentPrice)}
              />
              <InfoCard
                label="Description"
                value={transaction.description?.trim() || 'No description'}
                fullWidth
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type InfoCardProps = {
  fullWidth?: boolean;
  label: string;
  value: string;
};

function InfoCard({ label, value, fullWidth = false }: InfoCardProps) {
  return (
    <View style={[styles.infoCard, fullWidth && styles.infoCardFullWidth]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
