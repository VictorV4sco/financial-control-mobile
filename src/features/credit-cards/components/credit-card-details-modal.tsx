import { Modal, Pressable, Text, TextInput, View } from 'react-native';

import { CreditCardVisual } from './credit-card-visual';
import { styles } from './styles/credit-card-details-modal.styles';
import type { CreditCardReadDTO } from '@/types';

type CreditCardDetailsModalProps = {
  card: CreditCardReadDTO | null;
  editName: string;
  index: number;
  isDeleting: boolean;
  isUpdating: boolean;
  onClose: () => void;
  onDelete: () => void;
  onEditNameChange: (value: string) => void;
  onUpdate: () => void;
};

export function CreditCardDetailsModal({
  card,
  editName,
  index,
  isDeleting,
  isUpdating,
  onClose,
  onDelete,
  onEditNameChange,
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
            <Text style={styles.inputLabel}>Card name</Text>
            <TextInput
              value={editName}
              onChangeText={onEditNameChange}
              placeholder="Everyday card"
              placeholderTextColor="#7B8794"
              autoCapitalize="words"
              style={styles.input}
            />
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
