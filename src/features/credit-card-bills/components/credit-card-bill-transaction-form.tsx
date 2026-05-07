import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AccountsPayableDateField } from '../../accounts-payable/components/accounts-payable-date-field';
import { styles } from './styles/credit-card-bill-transaction-form.styles';
import type { TransactionInsertDTO } from '@/types';

type CreditCardBillTransactionFormProps = {
  formState: TransactionFormState;
  hasLoadedBill: boolean;
  isSubmitting: boolean;
  onChange: (updater: (current: TransactionFormState) => TransactionFormState) => void;
  onSubmit: () => void;
};

export type TransactionFormState = {
  date: string;
  description: string;
  installmentCount: string;
  installmentPurchase: boolean;
  name: string;
  price: string;
};

export function CreditCardBillTransactionForm({
  formState,
  hasLoadedBill,
  isSubmitting,
  onChange,
  onSubmit,
}: CreditCardBillTransactionFormProps) {
  if (!hasLoadedBill) {
    return (
      <>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Add transaction</Text>
          <Text style={styles.panelSubtitle}>
            Create one transaction directly inside the currently loaded bill.
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Load one bill first</Text>
          <Text style={styles.emptyDescription}>
            Use the year and month above to access one bill before adding transactions.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Add transaction</Text>
        <Text style={styles.panelSubtitle}>
          Create one transaction directly inside the currently loaded bill.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          value={formState.name}
          onChangeText={(value) => onChange((current) => ({ ...current, name: value }))}
          placeholder="Groceries"
          placeholderTextColor="#7B8794"
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          value={formState.description}
          onChangeText={(value) => onChange((current) => ({ ...current, description: value }))}
          placeholder="Optional details"
          placeholderTextColor="#7B8794"
          style={styles.input}
        />
      </View>

      <View style={styles.formRow}>
        <View style={styles.formColumn}>
          <AccountsPayableDateField
            label="Date"
            value={formState.date}
            onChange={(value) => onChange((current) => ({ ...current, date: value }))}
          />
        </View>

        <View style={styles.formColumn}>
          <Text style={styles.inputLabel}>Price</Text>
          <TextInput
            value={formState.price}
            onChangeText={(value) => onChange((current) => ({ ...current, price: value }))}
            placeholder="250.00"
            placeholderTextColor="#7B8794"
            keyboardType="decimal-pad"
            style={styles.input}
          />
        </View>
      </View>

      <Pressable
        onPress={() =>
          onChange((current) => ({
            ...current,
            installmentPurchase: !current.installmentPurchase,
            installmentCount: !current.installmentPurchase ? current.installmentCount : '1',
          }))
        }
        style={styles.checkboxRow}>
        <View style={[styles.checkbox, formState.installmentPurchase && styles.checkboxChecked]}>
          {formState.installmentPurchase ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : null}
        </View>
        <View style={styles.checkboxContent}>
          <Text style={styles.checkboxLabel}>Installment purchase</Text>
          <Text style={styles.checkboxHint}>
            Turn this on when the transaction should be split across installments.
          </Text>
        </View>
      </Pressable>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Installment count</Text>
        <TextInput
          value={formState.installmentPurchase ? formState.installmentCount : '1'}
          onChangeText={(value) =>
            onChange((current) => ({ ...current, installmentCount: value }))
          }
          placeholder="1"
          placeholderTextColor="#7B8794"
          keyboardType="number-pad"
          editable={formState.installmentPurchase}
          style={styles.input}
        />
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting}
        style={[styles.actionButton, isSubmitting && styles.actionButtonDisabled]}>
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.actionButtonText}>Save transaction</Text>
        )}
      </Pressable>
    </>
  );
}

export function buildTransactionPayload(
  creditCardBillId: number | null,
  formState: TransactionFormState
): TransactionInsertDTO | null {
  if (!creditCardBillId) {
    return null;
  }

  const parsedPrice = Number.parseFloat(formState.price.replace(',', '.'));
  const parsedInstallmentCount = Number.parseInt(
    formState.installmentPurchase ? formState.installmentCount : '1',
    10
  );

  if (
    !formState.name.trim() ||
    !formState.date.trim() ||
    Number.isNaN(parsedPrice) ||
    Number.isNaN(parsedInstallmentCount) ||
    parsedInstallmentCount < 1
  ) {
    return null;
  }

  return {
    creditCardBillId,
    name: formState.name.trim(),
    description: formState.description.trim() ? formState.description.trim() : null,
    date: formState.date.trim(),
    installmentPurchase: formState.installmentPurchase,
    installmentCount: formState.installmentPurchase ? parsedInstallmentCount : 1,
    price: parsedPrice,
  };
}
