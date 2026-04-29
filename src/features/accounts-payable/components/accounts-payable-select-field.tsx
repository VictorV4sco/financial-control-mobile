import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type AccountsPayableSelectFieldProps<T extends number | string> = {
  isOpen: boolean;
  label: string;
  onOptionPress: (value: T) => void;
  onToggle: () => void;
  options: {
    label: string;
    value: T;
  }[];
  selectedLabel: string;
  selectedValue: T;
};

export function AccountsPayableSelectField<T extends number | string>({
  label,
  isOpen,
  onToggle,
  options,
  selectedLabel,
  selectedValue,
  onOptionPress,
}: AccountsPayableSelectFieldProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable onPress={onToggle} style={styles.field}>
        <Text style={styles.fieldValue}>{selectedLabel}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={18}
          color="#334155"
        />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onToggle}>
        <View style={styles.modalRoot}>
          <Pressable onPress={onToggle} style={styles.backdrop} />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label.toLowerCase()}</Text>
              <Pressable onPress={onToggle} style={styles.closeButton}>
                <Ionicons name="close-outline" size={18} color="#334155" />
              </Pressable>
            </View>

            <ScrollView
              nestedScrollEnabled
              style={styles.optionsScroll}
              contentContainerStyle={styles.optionsCard}
              showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const isSelected = option.value === selectedValue;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => onOptionPress(option.value)}
                    style={[styles.option, isSelected && styles.optionSelected]}>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  field: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 13, 25, 0.16)',
  },
  modalCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsScroll: {
    maxHeight: 280,
  },
  optionsCard: {
    gap: 6,
  },
  option: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionSelected: {
    backgroundColor: '#0F172A',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  optionTextSelected: {
    color: '#F8FAFC',
  },
});
