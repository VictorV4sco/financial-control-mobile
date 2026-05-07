import { Text, TextInput, View } from 'react-native';

import {
  sanitizeDayInput,
  type CreditCardFormState,
} from '../credit-card-form.utils';
import { styles } from './styles/credit-card-cycle-form-fields.styles';

type CreditCardCycleFormFieldsProps = {
  formState: CreditCardFormState;
  onChange: (updater: (current: CreditCardFormState) => CreditCardFormState) => void;
};

export function CreditCardCycleFormFields({
  formState,
  onChange,
}: CreditCardCycleFormFieldsProps) {
  return (
    <>
      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Card name</Text>
        <TextInput
          value={formState.name}
          onChangeText={(value) => onChange((current) => ({ ...current, name: value }))}
          placeholder="Everyday card"
          placeholderTextColor="#7B8794"
          autoCapitalize="words"
          style={styles.input}
        />
      </View>

      <View style={styles.formRow}>
        <DayField
          label="Opening day"
          value={formState.openingDay}
          placeholder="10"
          onChange={(value) =>
            onChange((current) => ({ ...current, openingDay: sanitizeDayInput(value) }))
          }
        />

        <DayField
          label="Closing day"
          value={formState.closingDay}
          placeholder="17"
          onChange={(value) =>
            onChange((current) => ({ ...current, closingDay: sanitizeDayInput(value) }))
          }
        />

        <DayField
          label="Due day"
          value={formState.dueDay}
          placeholder="25"
          onChange={(value) =>
            onChange((current) => ({ ...current, dueDay: sanitizeDayInput(value) }))
          }
        />
      </View>
    </>
  );
}

type DayFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function DayField({ label, onChange, placeholder, value }: DayFieldProps) {
  return (
    <View style={styles.formColumn}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#7B8794"
        keyboardType="number-pad"
        style={styles.input}
      />
    </View>
  );
}
