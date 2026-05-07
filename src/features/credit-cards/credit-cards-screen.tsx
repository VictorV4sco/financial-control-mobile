import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  buildCreditCardPayload,
  createFormStateFromCard,
  INITIAL_CREDIT_CARD_FORM_STATE,
} from './credit-card-form.utils';
import { CreditCardCycleFormFields } from './components/credit-card-cycle-form-fields';
import { CreditCardDetailsModal } from './components/credit-card-details-modal';
import { styles } from './components/styles/credit-cards-screen.styles';
import { CreditCardVisual } from './components/credit-card-visual';
import {
  createCreditCard,
  deleteCreditCard,
  getCreditCards,
  normalizeApiError,
  updateCreditCard,
} from '@/service';
import type { CreditCardReadDTO } from '@/types';

export function CreditCardsScreen() {
  const [formState, setFormState] = useState(INITIAL_CREDIT_CARD_FORM_STATE);
  const [cards, setCards] = useState<CreditCardReadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCardReadDTO | null>(null);
  const [editFormState, setEditFormState] = useState(INITIAL_CREDIT_CARD_FORM_STATE);

  const selectedCardIndex = useMemo(
    () => cards.findIndex((card) => card.id === selectedCard?.id),
    [cards, selectedCard?.id]
  );

  useEffect(() => {
    void loadCreditCards();
  }, []);

  async function loadCreditCards() {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  }

  async function handleCreateCreditCard() {
    const payload = buildCreditCardPayload(formState);

    if (!payload) {
      showErrorAlert(
        'Please enter a card name and valid opening, closing, and due days before saving.'
      );
      return;
    }

    try {
      setIsCreating(true);
      const createdCard = await createCreditCard(payload);

      setCards((current) => [createdCard, ...current]);
      setFormState(INITIAL_CREDIT_CARD_FORM_STATE);
      showSuccessAlert(`Saved "${createdCard.name}" successfully.`);
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  }

  function handleClearForm() {
    setFormState(INITIAL_CREDIT_CARD_FORM_STATE);
  }

  function handleOpenCard(card: CreditCardReadDTO) {
    setSelectedCard(card);
    setEditFormState(createFormStateFromCard(card));
  }

  function handleCloseCardModal() {
    setSelectedCard(null);
    setEditFormState(INITIAL_CREDIT_CARD_FORM_STATE);
  }

  async function handleUpdateCard() {
    if (!selectedCard) {
      return;
    }

    const payload = buildCreditCardPayload(editFormState);

    if (!payload) {
      showErrorAlert(
        'Please enter a card name and valid opening, closing, and due days before updating.'
      );
      return;
    }

    try {
      setIsUpdating(true);
      const updatedCard = await updateCreditCard(selectedCard.id, {
        ...payload,
        id: selectedCard.id,
      });

      setCards((current) =>
        current.map((card) => (card.id === updatedCard.id ? updatedCard : card))
      );
      setSelectedCard(updatedCard);
      setEditFormState(createFormStateFromCard(updatedCard));
      showSuccessAlert(`Updated "${updatedCard.name}" successfully.`);
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  }

  function handleDeleteCard() {
    if (!selectedCard) {
      return;
    }

    Alert.alert('Delete card', `Are you sure you want to delete "${selectedCard.name}"?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => void confirmDeleteCard(),
      },
    ]);
  }

  async function confirmDeleteCard() {
    if (!selectedCard) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCreditCard(selectedCard.id);
      setCards((current) => current.filter((card) => card.id !== selectedCard.id));
      const deletedCardName = selectedCard.name;
      handleCloseCardModal();
      showSuccessAlert(`Deleted "${deletedCardName}" successfully.`);
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
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
        <Text style={styles.screenTitle}>Credit Cards</Text>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Add card</Text>
            <Text style={styles.panelSubtitle}>
              Create the card and define its monthly billing cycle once.
            </Text>
          </View>

          <CreditCardCycleFormFields formState={formState} onChange={setFormState} />

          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCreateCreditCard}
              disabled={isCreating}
              style={[styles.primaryButton, isCreating && styles.buttonDisabled]}>
              {isCreating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Save card</Text>
              )}
            </Pressable>

            <Pressable onPress={handleClearForm} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your cards</Text>
            <Text style={styles.sectionSubtitle}>
              Tap a card to preview it, update its cycle, or delete it.
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#0F172A" />
            <Text style={styles.loadingText}>Loading cards...</Text>
          </View>
        ) : cards.length > 0 ? (
          <View style={styles.cardsList}>
            {cards.map((card, index) => (
              <Pressable key={card.id} onPress={() => handleOpenCard(card)} style={styles.cardPressable}>
                <CreditCardVisual cardId={card.id} index={index} name={card.name} compact />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No cards saved yet</Text>
            <Text style={styles.emptyDescription}>
              Your saved cards will appear here as soon as you create the first one.
            </Text>
          </View>
        )}
      </ScrollView>

      <CreditCardDetailsModal
        card={selectedCard}
        editFormState={editFormState}
        index={selectedCardIndex >= 0 ? selectedCardIndex : 0}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
        onClose={handleCloseCardModal}
        onDelete={handleDeleteCard}
        onFormChange={setEditFormState}
        onUpdate={handleUpdateCard}
      />
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
