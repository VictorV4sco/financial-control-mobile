import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AccountsPayableDateField } from './accounts-payable-date-field';
import { styles } from './styles/accounts-payable-edit-modal.styles';

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
