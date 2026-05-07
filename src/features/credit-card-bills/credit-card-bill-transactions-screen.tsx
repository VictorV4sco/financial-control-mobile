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

import { CreditCardBillTransactionDetailsModal } from './components/credit-card-bill-transaction-details-modal';
import { CreditCardBillTransactionsTable } from './components/credit-card-bill-transactions-table';
import { styles } from './components/styles/credit-card-bill-transactions-screen.styles';
import { getTransactionsByCreditCardBill, normalizeApiError } from '@/service';
import type { TransactionReadDTO } from '@/types';

export function CreditCardBillTransactionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    billId?: string;
    cardName?: string;
  }>();

  const billId = Number.parseInt(params.billId ?? '0', 10);
  const cardName = params.cardName ?? 'Credit card';
  const [transactions, setTransactions] = useState<TransactionReadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionReadDTO | null>(
    null
  );
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  useEffect(() => {
    async function loadTransactions() {
      if (!Number.isInteger(billId) || billId <= 0) {
        showErrorAlert('The selected bill is invalid.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getTransactionsByCreditCardBill({
          creditCardBillId: billId,
        });
        setTransactions(response);
      } catch (error) {
        const normalizedError = normalizeApiError(error);

        if (normalizedError.status === 404) {
          setTransactions([]);
          return;
        }

        showErrorAlert(normalizedError.message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadTransactions();
  }, [billId]);

  function handleOpenDetails(transaction: TransactionReadDTO) {
    setSelectedTransaction(transaction);
    setIsDetailsVisible(true);
  }

  function handleCloseDetails() {
    setIsDetailsVisible(false);
    setSelectedTransaction(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={20} color="#0F172A" />
          </Pressable>

          <View style={styles.headerTextBlock}>
            <Text style={styles.screenTitle}>Bill transactions</Text>
            <Text style={styles.screenSubtitle}>{cardName}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Bill {billId}</Text>
          <Text style={styles.infoSubtitle}>
            Review every saved transaction and open the details icon for the full payload.
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : (
          <CreditCardBillTransactionsTable
            transactions={transactions}
            onOpenDetails={handleOpenDetails}
          />
        )}
      </ScrollView>

      <CreditCardBillTransactionDetailsModal
        visible={isDetailsVisible}
        onClose={handleCloseDetails}
        transaction={selectedTransaction}
      />
    </SafeAreaView>
  );
}

function showErrorAlert(message: string) {
  Alert.alert('Error', message);
}
