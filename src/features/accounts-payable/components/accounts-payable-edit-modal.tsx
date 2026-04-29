import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AccountsPayableDateField } from './accounts-payable-date-field';

type AccountsPayableEditModalProps = {
  amount: string;
  description: string;
  dueDate: string;
  isPaid: boolean;
  isSubmitting: boolean;
  minimumDueDate: Date;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onPaidChange: (value: boolean) => void;
  onSubmit: () => void;
  visible: boolean;
};

export function AccountsPayableEditModal({
  visible,
  onClose,
  description,
  amount,
  dueDate,
  isPaid,
  onDescriptionChange,
  onAmountChange,
  onDueDateChange,
  onPaidChange,
  onSubmit,
  isSubmitting,
  minimumDueDate,
}: AccountsPayableEditModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Edit bill</Text>
            <Text style={styles.subtitle}>
              Update this bill without leaving the monthly summary.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={onDescriptionChange}
                placeholder="Energy bill"
                placeholderTextColor="#7B8794"
                autoCapitalize="sentences"
                keyboardType="default"
                style={styles.input}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  value={amount}
                  onChangeText={onAmountChange}
                  placeholder="250.00"
                  placeholderTextColor="#7B8794"
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
              </View>

              <View style={styles.column}>
                <AccountsPayableDateField
                  label="Due date"
                  value={dueDate}
                  onChange={onDueDateChange}
                  minimumDate={minimumDueDate}
                />
              </View>
            </View>

            <Pressable onPress={() => onPaidChange(!isPaid)} style={styles.checkboxRow}>
              <View style={[styles.checkbox, isPaid && styles.checkboxChecked]}>
                {isPaid ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
              </View>
              <View style={styles.checkboxContent}>
                <Text style={styles.checkboxLabel}>Paid</Text>
                <Text style={styles.checkboxHint}>
                  Mark this option when the account has already been paid.
                </Text>
              </View>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable onPress={onClose} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={onSubmit}
                disabled={isSubmitting}
                style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}>
                <Text style={styles.primaryButtonText}>
                  {isSubmitting ? 'Saving...' : 'Update'}
                </Text>
              </Pressable>
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
    backgroundColor: 'rgba(7, 13, 25, 0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#51606F',
  },
  fieldGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    backgroundColor: '#F8FAFC',
    padding: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    borderColor: '#0B6E4F',
    backgroundColor: '#0B6E4F',
  },
  checkboxContent: {
    flex: 1,
    gap: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  checkboxHint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#51606F',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#0B6E4F',
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
