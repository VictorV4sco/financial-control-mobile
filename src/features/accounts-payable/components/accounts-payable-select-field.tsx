import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './styles/accounts-payable-select-field.styles';

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
