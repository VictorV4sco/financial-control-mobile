import { Modal, Pressable, Text, View } from 'react-native';

import { type CreditCardFormState } from '../credit-card-form.utils';
import { CreditCardCycleFormFields } from './credit-card-cycle-form-fields';
import { CreditCardVisual } from './credit-card-visual';
import { styles } from './styles/credit-card-details-modal.styles';
import type { CreditCardReadDTO } from '@/types';

type CreditCardDetailsModalProps = {
  card: CreditCardReadDTO | null;
  editFormState: CreditCardFormState;
  index: number;
  isDeleting: boolean;
  isUpdating: boolean;
  onClose: () => void;
  onDelete: () => void;
  onFormChange: (updater: (current: CreditCardFormState) => CreditCardFormState) => void;
  onUpdate: () => void;
};

export function CreditCardDetailsModal({
  card,
  editFormState,
  index,
  isDeleting,
  isUpdating,
  onClose,
  onDelete,
  onFormChange,
  onUpdate,
}: CreditCardDetailsModalProps) {
  if (!card) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={styles.backdrop} />

        <View style={styles.card}>
          <Text style={styles.eyebrow}>Selected card</Text>
          <Text style={styles.title}>Manage card</Text>

          <CreditCardVisual cardId={card.id} index={index} name={card.name} />

          <View style={styles.formCard}>
            <CreditCardCycleFormFields formState={editFormState} onChange={onFormChange} />
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={onUpdate}
              disabled={isUpdating}
              style={[styles.primaryButton, isUpdating && styles.buttonDisabled]}>
              <Text style={styles.primaryButtonText}>
                {isUpdating ? 'Updating...' : 'Update'}
              </Text>
            </Pressable>

            <Pressable
              onPress={onDelete}
              disabled={isDeleting}
              style={[styles.deleteButton, isDeleting && styles.buttonDisabled]}>
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
