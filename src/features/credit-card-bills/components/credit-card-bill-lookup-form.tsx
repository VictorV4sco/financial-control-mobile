import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { styles } from './styles/credit-card-bill-lookup-form.styles';

type CreditCardBillLookupFormProps = {
  actionLabel?: string;
  isLoading: boolean;
  month: string;
  onLoadBill: () => void;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  showHeader?: boolean;
  year: string;
};

export function CreditCardBillLookupForm({
  actionLabel = 'Access',
  year,
  month,
  onYearChange,
  onMonthChange,
  onLoadBill,
  isLoading,
  showHeader = true,
}: CreditCardBillLookupFormProps) {
  return (
    <>
      {showHeader ? (
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Find bill</Text>
          <Text style={styles.panelSubtitle}>
            Enter the year and month you want to inspect for this card.
          </Text>
        </View>
      ) : null}

      <View style={styles.lookupRow}>
        <View style={styles.fieldBlock}>
          <Text style={styles.inputLabel}>Year</Text>
          <TextInput
            value={year}
            onChangeText={onYearChange}
            placeholder="2026"
            placeholderTextColor="#7B8794"
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.inputLabel}>Month</Text>
          <TextInput
            value={month}
            onChangeText={onMonthChange}
            placeholder="05"
            placeholderTextColor="#7B8794"
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={onLoadBill}
          disabled={isLoading}
          style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          )}
        </Pressable>
      </View>
    </>
  );
}
