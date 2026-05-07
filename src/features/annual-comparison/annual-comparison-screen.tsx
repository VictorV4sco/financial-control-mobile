import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { AnnualComparisonSummaryCards } from './components/annual-comparison-summary-cards';
import { AnnualComparisonYearForm } from './components/annual-comparison-year-form';
import { getCurrentYear, sanitizeYearInput } from './annual-comparison.utils';
import { styles } from './components/styles/annual-comparison-screen.styles';
import { getAnnualComparison, normalizeApiError } from '@/service';
import type { AnnualComparisonSummary } from '@/types';

export function AnnualComparisonScreen() {
  const router = useRouter();
  const [year, setYear] = useState(String(getCurrentYear()));
  const [summary, setSummary] = useState<AnnualComparisonSummary | null>(null);
  const [loadedYear, setLoadedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function loadInitialSummary() {
      const initialYear = getCurrentYear();

      try {
        setIsLoading(true);
        const response = await getAnnualComparison(initialYear);
        setSummary(response);
        setLoadedYear(initialYear);
        setYear(String(initialYear));
      } catch (error) {
        showErrorAlert(normalizeApiError(error).message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadInitialSummary();
  }, []);

  async function loadSummary(targetYear?: number) {
    const parsedYear = targetYear ?? Number.parseInt(year, 10);

    if (!parsedYear) {
      showErrorAlert('Please enter a valid year before loading the summary.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getAnnualComparison(parsedYear);
      setSummary(response);
      setLoadedYear(parsedYear);
      setYear(String(parsedYear));
    } catch (error) {
      showErrorAlert(normalizeApiError(error).message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefresh() {
    if (!loadedYear) {
      return;
    }

    try {
      setIsRefreshing(true);
      const response = await getAnnualComparison(loadedYear);
      setSummary(response);
    } catch (error) {
      showErrorAlert(normalizeApiError(error).message);
    } finally {
      setIsRefreshing(false);
    }
  }

  function handleViewChart() {
    const parsedYear = Number.parseInt(year, 10);

    if (!parsedYear) {
      showErrorAlert('Please enter a valid year before opening the chart.');
      return;
    }

    router.push({
      pathname: '/annual-comparison/[year]',
      params: {
        year: String(parsedYear),
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void handleRefresh()}
          />
        }
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Annual comparison</Text>

        <View style={styles.panel}>
          <AnnualComparisonYearForm
            year={year}
            isLoading={isLoading}
            onChangeYear={(value) => setYear(sanitizeYearInput(value))}
            onLoadSummary={() => void loadSummary()}
            onViewChart={handleViewChart}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.loadingText}>Loading annual summary...</Text>
          </View>
        ) : (
          <AnnualComparisonSummaryCards summary={summary} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function showErrorAlert(message: string) {
  Alert.alert('Error', message);
}
