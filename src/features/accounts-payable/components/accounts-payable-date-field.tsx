import { useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles/accounts-payable-date-field.styles';

type AccountsPayableDateFieldProps = {
  label: string;
  minimumDate?: Date;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function AccountsPayableDateField({
  label,
  minimumDate,
  onChange,
  placeholder = 'YYYY-MM-DD',
  value,
}: AccountsPayableDateFieldProps) {
  const [isIosPickerVisible, setIsIosPickerVisible] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState<Date>(() =>
    getPickerValue(parseDateString(value), minimumDate)
  );

  useEffect(() => {
    setIosDraftDate(getPickerValue(parseDateString(value), minimumDate));
  }, [minimumDate, value]);

  function handleOpenPicker() {
    const pickerValue = getPickerValue(parseDateString(value), minimumDate);

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: pickerValue,
        onChange: handleAndroidChange,
        mode: 'date',
        display: 'calendar',
        minimumDate,
      });
      return;
    }

    if (Platform.OS === 'ios') {
      setIosDraftDate(pickerValue);
      setIsIosPickerVisible(true);
    }
  }

  function handleAndroidChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (event.type !== 'set' || !selectedDate) {
      return;
    }

    onChange(formatDateString(selectedDate));
  }

  function handleConfirmIosDate() {
    onChange(formatDateString(iosDraftDate));
    setIsIosPickerVisible(false);
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#7B8794"
          style={styles.input}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Pressable onPress={handleOpenPicker} style={styles.input}>
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#334155" />
      </Pressable>

      <Modal
        visible={isIosPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsIosPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setIsIosPickerVisible(false)} />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select due date</Text>
            </View>

            <DateTimePicker
              value={iosDraftDate}
              mode="date"
              display="inline"
              minimumDate={minimumDate}
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  setIosDraftDate(selectedDate);
                }
              }}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setIsIosPickerVisible(false)}
                style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>

              <Pressable onPress={handleConfirmIosDate} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function parseDateString(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), 12);
}

function getPickerValue(value: Date | null, minimumDate?: Date): Date {
  if (!value) {
    return minimumDate ?? getTodayDate();
  }

  if (minimumDate && value < minimumDate) {
    return minimumDate;
  }

  return value;
}

function getTodayDate(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
