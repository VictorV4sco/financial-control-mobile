import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { getCurrentMonth, getCurrentYear } from '../accounts-payable/accounts-payable.utils';
import { CreditCardVisual } from '../credit-cards/components/credit-card-visual';
import {
  buildTransactionPayload,
  CreditCardBillTransactionForm,
  type TransactionFormState,
} from './components/credit-card-bill-transaction-form';
import { CreditCardBillLookupForm } from './components/credit-card-bill-lookup-form';
import { CreditCardBillSummaryCard } from './components/credit-card-bill-summary-card';
import { styles } from './components/styles/credit-card-bill-details-screen.styles';
import {
  createTransaction,
  getCreditCardBillByMonthAndYear,
  normalizeApiError,
} from '@/service';
import type { CreditCardBillReadDTO } from '@/types';

const INITIAL_TRANSACTION_FORM_STATE: TransactionFormState = {
  name: '',
  description: '',
  date: '',
  installmentPurchase: false,
  installmentCount: '1',
  price: '',
};

export function CreditCardBillDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    cardId?: string;
    cardIndex?: string;
    cardName?: string;
  }>();

  const cardId = Number.parseInt(params.cardId ?? '0', 10);
  const cardName = params.cardName ?? 'Credit card';
  const cardIndex = Number.parseInt(params.cardIndex ?? '0', 10);
  const [year, setYear] = useState(String(getCurrentYear()));
  const [month, setMonth] = useState(String(getCurrentMonth()).padStart(2, '0'));
  const [bill, setBill] = useState<CreditCardBillReadDTO | null>(null);
  const [isLoadingBill, setIsLoadingBill] = useState(false);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [transactionFormState, setTransactionFormState] = useState(
    INITIAL_TRANSACTION_FORM_STATE
  );

  const normalizedCardId = Number.isInteger(cardId) && cardId > 0 ? cardId : null;
  const cardVisualIndex = useMemo(
    () => (Number.isNaN(cardIndex) ? 0 : cardIndex),
    [cardIndex]
  );

  async function loadBillForSelectedPeriod(options?: { silent?: boolean }) {
    const normalizedYear = parsePeriodValue(year);
    const normalizedMonth = parsePeriodValue(month);

    if (!normalizedCardId || !normalizedYear || !normalizedMonth) {
      if (!options?.silent) {
        showErrorAlert('Please enter a valid year and month before accessing the bill.');
      }
      return null;
    }

    try {
      if (!options?.silent) {
        setIsLoadingBill(true);
      }

      const response = await getCreditCardBillByMonthAndYear({
        creditCardId: normalizedCardId,
        year: normalizedYear,
        month: normalizedMonth,
      });

      setBill(response);
      return response;
    } catch (error) {
      setBill(null);

      if (!options?.silent) {
        showErrorAlert(getApiErrorMessage(error));
      }

      return null;
    } finally {
      if (!options?.silent) {
        setIsLoadingBill(false);
      }
    }
  }

  async function handleLoadBill() {
    await loadBillForSelectedPeriod();
  }

  async function handleCreateTransaction() {
    const payload = buildTransactionPayload(bill?.id ?? null, transactionFormState);

    if (!payload) {
      showErrorAlert(
        'Please fill in name, date, installment count, and price before saving the transaction.'
      );
      return;
    }

    try {
      setIsCreatingTransaction(true);
      await createTransaction(payload);
      await loadBillForSelectedPeriod({ silent: true });
      setTransactionFormState(INITIAL_TRANSACTION_FORM_STATE);
      showSuccessAlert('Transaction created successfully.');
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsCreatingTransaction(false);
    }
  }

  async function handleViewBill() {
    if (!bill) {
      showErrorAlert('Load one bill before viewing its transactions.');
      return;
    }

    router.push({
      pathname: '/bill-transactions/[billId]',
      params: {
        billId: String(bill.id),
        cardName,
      },
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={20} color="#0F172A" />
          </Pressable>

          <View style={styles.headerTextBlock}>
            <Text style={styles.screenTitle}>Bill details</Text>
            <Text style={styles.screenSubtitle}>{cardName}</Text>
          </View>
        </View>

        <View style={styles.cardFrame}>
          <CreditCardVisual
            cardId={normalizedCardId ?? undefined}
            index={cardVisualIndex}
            name={cardName}
          />
        </View>

        <View style={styles.panel}>
          <CreditCardBillSummaryCard
            bill={bill}
            controls={
              <CreditCardBillLookupForm
                year={year}
                month={month}
                onYearChange={(value) => setYear(sanitizePeriodInput(value, 4))}
                onMonthChange={(value) => setMonth(sanitizePeriodInput(value, 2))}
                onLoadBill={() => void handleLoadBill()}
                isLoading={isLoadingBill}
                showHeader={false}
              />
            }
            isViewingBill={false}
            onViewBill={() => void handleViewBill()}
          />
        </View>

        <View style={styles.panel}>
          <CreditCardBillTransactionForm
            formState={transactionFormState}
            hasLoadedBill={Boolean(bill)}
            isSubmitting={isCreatingTransaction}
            onChange={(updater) => setTransactionFormState((current) => updater(current))}
            onSubmit={() => void handleCreateTransaction()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getApiErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

function showSuccessAlert(message: string) {
  Alert.alert('Success', message);
}

function showErrorAlert(message: string) {
  Alert.alert('Error', message);
}

function parsePeriodValue(value: string): number {
  return Number.parseInt(value.replace(/\D/g, ''), 10);
}

function sanitizePeriodInput(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
}
