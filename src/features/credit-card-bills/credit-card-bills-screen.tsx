import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getCurrentMonth, getCurrentYear } from '../accounts-payable/accounts-payable.utils';
import { CreditCardVisual } from '../credit-cards/components/credit-card-visual';
import { CreditCardBillLookupForm } from './components/credit-card-bill-lookup-form';
import { styles } from './components/styles/credit-card-bills-screen.styles';
import {
  createCreditCardBill,
  getCreditCards,
  normalizeApiError,
} from '@/service';
import type { CreditCardReadDTO } from '@/types';

type CreditCardBillFormState = {
  creditCardId: string;
  month: string;
  year: string;
};

export function CreditCardBillsScreen() {
  const router = useRouter();
  const [formState, setFormState] = useState(() => createInitialFormState());
  const [cards, setCards] = useState<CreditCardReadDTO[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    void loadCreditCards();
  }, []);

  async function loadCreditCards() {
    try {
      setIsLoadingCards(true);
      const response = await getCreditCards();
      setCards(response);
    } catch (error) {
      const normalizedError = normalizeApiError(error);

      if (normalizedError.status === 404) {
        setCards([]);
        return;
      }

      showErrorAlert(normalizedError.message);
    } finally {
      setIsLoadingCards(false);
    }
  }

  async function handleCreateBill() {
    const payload = buildPayload(formState);

    if (!payload) {
      showErrorAlert('Please fill in credit card ID, year, and month before saving.');
      return;
    }

    try {
      setIsCreatingBill(true);
      await createCreditCardBill(payload);
      setFormState(createInitialFormState());
      showSuccessAlert('Bill created successfully.');
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsCreatingBill(false);
    }
  }

  function handleClearForm() {
    setFormState(createInitialFormState());
  }

  function handleOpenBillDetails(card: CreditCardReadDTO, index: number) {
    router.push({
      pathname: '/bill-details/[cardId]',
      params: {
        cardId: String(card.id),
        cardIndex: String(index),
        cardName: card.name,
      },
    });
  }

  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      const response = await getCreditCards();
      setCards(response);
    } catch (error) {
      const normalizedError = normalizeApiError(error);

      if (normalizedError.status === 404) {
        setCards([]);
        return;
      }

      showErrorAlert(normalizedError.message);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => void handleRefresh()} />
        }
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Credit Card Bills</Text>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Add bill</Text>
            <Text style={styles.panelSubtitle}>
              Use the card ID and billing period. The backend calculates the dates from the
              card cycle automatically.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Credit card ID</Text>
            <TextInput
              value={formState.creditCardId}
              onChangeText={(value) =>
                setFormState((current) => ({
                  ...current,
                  creditCardId: sanitizeNumericInput(value, 6),
                }))
              }
              placeholder="1"
              placeholderTextColor="#7B8794"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <CreditCardBillLookupForm
            year={formState.year}
            month={formState.month}
            onYearChange={(value) =>
              setFormState((current) => ({
                ...current,
                year: sanitizeNumericInput(value, 4),
              }))
            }
            onMonthChange={(value) =>
              setFormState((current) => ({
                ...current,
                month: sanitizeNumericInput(value, 2),
              }))
            }
            onLoadBill={() => void handleCreateBill()}
            isLoading={isCreatingBill}
            actionLabel="Create bill"
          />

          <View style={styles.actionsRow}>
            <Pressable onPress={handleClearForm} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Available cards</Text>
            <Text style={styles.sectionSubtitle}>
              Each card shows its credit card ID. Tap one card to open its bill workspace.
            </Text>
          </View>
        </View>

        {isLoadingCards ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.loadingText}>Loading cards...</Text>
          </View>
        ) : cards.length > 0 ? (
          <View style={styles.cardsList}>
            {cards.map((card, index) => (
              <Pressable
                key={card.id}
                onPress={() => handleOpenBillDetails(card, index)}
                style={({ pressed }) => [
                  styles.cardPressable,
                  pressed && styles.cardPressablePressed,
                ]}>
                <View style={styles.cardFrame}>
                  <CreditCardVisual cardId={card.id} index={index} name={card.name} compact />
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No cards saved yet</Text>
            <Text style={styles.emptyDescription}>
              Create a credit card first so you can attach bills to a valid card ID.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function buildPayload(formState: CreditCardBillFormState) {
  const creditCardId = Number.parseInt(formState.creditCardId, 10);
  const year = Number.parseInt(formState.year, 10);
  const month = Number.parseInt(formState.month, 10);

  if (!creditCardId || !year || !month || month < 1 || month > 12) {
    return null;
  }

  return {
    creditCardId,
    year,
    month,
  };
}

function createInitialFormState(): CreditCardBillFormState {
  return {
    creditCardId: '',
    year: String(getCurrentYear()),
    month: String(getCurrentMonth()).padStart(2, '0'),
  };
}

function sanitizeNumericInput(value: string, maxLength: number): string {
  return value.replace(/\D/g, '').slice(0, maxLength);
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
