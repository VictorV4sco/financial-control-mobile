import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { styles } from './styles/annual-comparison-year-form.styles';

type AnnualComparisonYearFormProps = {
  isLoading: boolean;
  onChangeYear: (value: string) => void;
  onLoadSummary: () => void;
  onViewChart: () => void;
  year: string;
};

export function AnnualComparisonYearForm({
  year,
  isLoading,
  onChangeYear,
  onLoadSummary,
  onViewChart,
}: AnnualComparisonYearFormProps) {
  return (
    <>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Compare yearly spend</Text>
        <Text style={styles.panelSubtitle}>
          Choose one year to compare accounts payable and credit card bills month by month.
        </Text>
      </View>

      <View style={styles.formRow}>
        <View style={styles.fieldBlock}>
          <Text style={styles.inputLabel}>Year</Text>
          <TextInput
            value={year}
            onChangeText={onChangeYear}
            placeholder="2026"
            placeholderTextColor="#7B8794"
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={onLoadSummary}
          disabled={isLoading}
          style={[styles.primaryButton, isLoading && styles.buttonDisabled]}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Load summary</Text>
          )}
        </Pressable>
      </View>

      <Pressable onPress={onViewChart} style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>View annual comparison</Text>
      </Pressable>
    </>
  );
}
