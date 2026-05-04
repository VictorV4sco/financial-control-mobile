import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AccountsPayableDateField } from '../accounts-payable/components/accounts-payable-date-field';
import { CreditCardVisual } from '../credit-cards/components/credit-card-visual';
import { styles } from './components/styles/credit-card-bills-screen.styles';
import {
  createCreditCardBill,
  getCreditCards,
  normalizeApiError,
} from '@/service';
import type { CreditCardBillInsertDTO, CreditCardReadDTO } from '@/types';

const INITIAL_FORM_STATE: CreditCardBillInsertDTO = {
  creditCardId: 0,
  openingDate: '',
  closingDate: '',
  dueDate: '',
};

export function CreditCardBillsScreen() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [cards, setCards] = useState<CreditCardReadDTO[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [minimumDate] = useState(() => getTodayDate());

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
      showErrorAlert(
        'Please fill in credit card ID, opening date, closing date, and due date before saving.'
      );
      return;
    }

    try {
      setIsCreatingBill(true);
      await createCreditCardBill(payload);
      setFormState(INITIAL_FORM_STATE);
      showSuccessAlert('Bill created successfully.');
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsCreatingBill(false);
    }
  }

  function handleClearForm() {
    setFormState(INITIAL_FORM_STATE);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Credit Card Bills</Text>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Add bill</Text>
            <Text style={styles.panelSubtitle}>
              Use the card ID below and define the bill opening, closing, and due dates.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Credit card ID</Text>
            <TextInput
              value={formState.creditCardId > 0 ? String(formState.creditCardId) : ''}
              onChangeText={(value) =>
                setFormState((current) => ({
                  ...current,
                  creditCardId: parseCreditCardId(value),
                }))
              }
              placeholder="1"
              placeholderTextColor="#7B8794"
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <AccountsPayableDateField
                label="Opening date"
                value={formState.openingDate}
                onChange={(value) =>
                  setFormState((current) => ({ ...current, openingDate: value }))
                }
              />
            </View>

            <View style={styles.formColumn}>
              <AccountsPayableDateField
                label="Closing date"
                minimumDate={minimumDate}
                value={formState.closingDate}
                onChange={(value) =>
                  setFormState((current) => ({ ...current, closingDate: value }))
                }
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <AccountsPayableDateField
              label="Due date"
              minimumDate={minimumDate}
              value={formState.dueDate}
              onChange={(value) =>
                setFormState((current) => ({ ...current, dueDate: value }))
              }
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCreateBill}
              disabled={isCreatingBill}
              style={[styles.primaryButton, isCreatingBill && styles.buttonDisabled]}>
              {isCreatingBill ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Save bill</Text>
              )}
            </Pressable>

            <Pressable onPress={handleClearForm} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Available cards</Text>
            <Text style={styles.sectionSubtitle}>
              Each card shows its credit card ID so you can create the correct bill.
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
              <View key={card.id} style={styles.cardFrame}>
                <CreditCardVisual cardId={card.id} index={index} name={card.name} compact />
              </View>
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

function buildPayload(
  formState: CreditCardBillInsertDTO
): CreditCardBillInsertDTO | null {
  if (
    !Number.isInteger(formState.creditCardId) ||
    formState.creditCardId <= 0 ||
    !formState.openingDate.trim() ||
    !formState.closingDate.trim() ||
    !formState.dueDate.trim()
  ) {
    return null;
  }

  return {
    creditCardId: formState.creditCardId,
    openingDate: formState.openingDate.trim(),
    closingDate: formState.closingDate.trim(),
    dueDate: formState.dueDate.trim(),
  };
}

function parseCreditCardId(value: string): number {
  const normalizedValue = value.replace(/\D/g, '');

  if (!normalizedValue) {
    return 0;
  }

  return Number.parseInt(normalizedValue, 10);
}

function getTodayDate(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
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
