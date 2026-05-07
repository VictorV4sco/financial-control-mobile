import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AnnualComparisonChart } from './components/annual-comparison-chart';
import { formatCurrency } from './annual-comparison.utils';
import { styles } from './components/styles/annual-comparison-graph-screen.styles';
import { getAnnualComparison, normalizeApiError } from '@/service';
import type { AnnualComparisonSummary } from '@/types';

export function AnnualComparisonGraphScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ year?: string }>();
  const year = Number.parseInt(params.year ?? '0', 10);
  const [summary, setSummary] = useState<AnnualComparisonSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentYearComparison() {
      if (!year) {
        showErrorAlert('The selected year is invalid.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getAnnualComparison(year);
        setSummary(response);
      } catch (error) {
        showErrorAlert(normalizeApiError(error).message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadCurrentYearComparison();
  }, [year]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={20} color="#0F172A" />
          </Pressable>

          <View style={styles.headerTextBlock}>
            <Text style={styles.screenTitle}>Annual comparison</Text>
            <Text style={styles.screenSubtitle}>{year}</Text>
          </View>
        </View>

        {isLoading || !summary ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.loadingText}>Loading chart...</Text>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>{formatCurrency(summary.annualCombinedTotal)}</Text>
              <Text style={styles.infoSubtitle}>
                Combined yearly spend across accounts payable and credit card bills.
              </Text>
            </View>

            <AnnualComparisonChart summary={summary} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function showErrorAlert(message: string) {
  Alert.alert('Error', message);
}
