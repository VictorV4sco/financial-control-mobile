import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AccountsPayableDateField } from './components/accounts-payable-date-field';
import { AccountsPayableEditModal } from './components/accounts-payable-edit-modal';
import { AccountsPayableResultsModal } from './components/accounts-payable-results-modal';
import { AccountsPayableSelectField } from './components/accounts-payable-select-field';
import { formatCurrency, getCurrentMonth, getCurrentYear } from './accounts-payable.utils';
import {
  createAccountsPayable,
  deleteAccountsPayable,
  getAccountsPayableByMonthAndYear,
  normalizeApiError,
  updateAccountsPayable,
} from '@/service';
import type { AccountsPayableInsertDTO, AccountsPayableReadDTO, PaymentStatus } from '@/types';

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: String(index + 1).padStart(2, '0'),
  value: index + 1,
}));

const YEAR_OPTIONS = Array.from({ length: 6 }, (_, index) => getCurrentYear() - 2 + index);

type FormState = {
  amount: string;
  description: string;
  dueDate: string;
};

type EditFormState = FormState & {
  isPaid: boolean;
};

const INITIAL_FORM_STATE: FormState = {
  description: '',
  amount: '',
  dueDate: '',
};

const INITIAL_EDIT_FORM_STATE: EditFormState = {
  ...INITIAL_FORM_STATE,
  isPaid: false,
};

export function AccountsPayableScreen() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [openFilter, setOpenFilter] = useState<'month' | 'year' | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [records, setRecords] = useState<AccountsPayableReadDTO[]>([]);
  const [isResultsModalVisible, setIsResultsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccountsPayableReadDTO | null>(null);
  const [editFormState, setEditFormState] = useState(INITIAL_EDIT_FORM_STATE);
  const [minimumDueDate] = useState(() => getTodayDate());

  const lastSearchTotal = records.reduce((sum, item) => sum + item.amount, 0);

  async function handleCreateAccountsPayable() {
    const payload = buildPayload(formState);

    if (!payload) {
      showErrorAlert('Please fill in description, amount, and due date before saving.');
      return;
    }

    try {
      setIsCreating(true);
      const createdRecord = await createAccountsPayable(payload);

      setFormState(INITIAL_FORM_STATE);
      showSuccessAlert(`Saved "${createdRecord.description}" successfully.`);
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleSearchAccountsPayable() {
    try {
      setIsSearching(true);
      const response = await getAccountsPayableByMonthAndYear({
        month: selectedMonth,
        year: selectedYear,
      });

      setRecords(response);
      setIsResultsModalVisible(true);
    } catch (error) {
      setRecords([]);
      setIsResultsModalVisible(false);
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  }

  function handleClearForm() {
    setFormState(INITIAL_FORM_STATE);
  }

  function handleSelectMonth(value: number) {
    setSelectedMonth(value);
    setOpenFilter(null);
  }

  function handleSelectYear(value: number) {
    setSelectedYear(value);
    setOpenFilter(null);
  }

  function handleOpenEditModal(record: AccountsPayableReadDTO) {
    setEditingRecord(record);
    setEditFormState({
      description: record.description,
      amount: String(record.amount),
      dueDate: record.dueDate,
      isPaid: record.status === 'PAID',
    });
  }

  function handleCloseEditModal() {
    setEditingRecord(null);
    setEditFormState(INITIAL_EDIT_FORM_STATE);
  }

  async function handleSubmitEdit() {
    if (!editingRecord) {
      return;
    }

    const payload = buildUpdatePayload(editFormState, editingRecord.status);

    if (!payload) {
      showErrorAlert('Please fill in description, amount, and due date before updating.');
      return;
    }

    try {
      setIsUpdating(true);
      await updateAccountsPayable(editingRecord.id, payload);
      handleCloseEditModal();
      const refreshResult = await refreshCurrentSearch();

      if (!refreshResult.ok) {
        showErrorAlert(refreshResult.message);
        return;
      }

      showSuccessAlert(`Updated "${editingRecord.description}" successfully.`);
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  }

  function handleDelete(record: AccountsPayableReadDTO) {
    Alert.alert(
      'Delete bill',
      `Are you sure you want to delete "${record.description}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void confirmDelete(record),
        },
      ]
    );
  }

  async function confirmDelete(record: AccountsPayableReadDTO) {
    try {
      setIsDeletingId(record.id);
      await deleteAccountsPayable(record.id);
      const refreshResult = await refreshCurrentSearch();

      if (!refreshResult.ok) {
        setRecords([]);
        setIsResultsModalVisible(false);
      }

      showSuccessAlert(`Deleted "${record.description}" successfully.`);
    } catch (error) {
      showErrorAlert(getApiErrorMessage(error));
    } finally {
      setIsDeletingId(null);
    }
  }

  async function refreshCurrentSearch() {
    try {
      const response = await getAccountsPayableByMonthAndYear({
        month: selectedMonth,
        year: selectedYear,
      });

      setRecords(response);
      setIsResultsModalVisible(true);
      return { ok: true as const };
    } catch (error) {
      setRecords([]);
      setIsResultsModalVisible(false);
      return {
        ok: false as const,
        message: getApiErrorMessage(error),
      };
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        scrollEnabled={openFilter === null}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Accounts Payable</Text>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Add bill</Text>
            <Text style={styles.panelSubtitle}>
              New bills start with the backend default status.
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              value={formState.description}
              onChangeText={(value) => setFormState((current) => ({ ...current, description: value }))}
              placeholder="Energy bill"
              placeholderTextColor="#7B8794"
              autoCapitalize="sentences"
              keyboardType="default"
              style={styles.input}
            />
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                value={formState.amount}
                onChangeText={(value) => setFormState((current) => ({ ...current, amount: value }))}
                placeholder="250.00"
                placeholderTextColor="#7B8794"
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.formColumn}>
              <AccountsPayableDateField
                label="Due date"
                value={formState.dueDate}
                onChange={(value) => setFormState((current) => ({ ...current, dueDate: value }))}
                minimumDate={minimumDueDate}
              />
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCreateAccountsPayable}
              disabled={isCreating}
              style={[styles.primaryButton, isCreating && styles.buttonDisabled]}>
              {isCreating ? (
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

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Monthly bills</Text>
          </View>

          <View style={styles.filterRow}>
            <AccountsPayableSelectField
              label="Month"
              isOpen={openFilter === 'month'}
              onToggle={() =>
                setOpenFilter((current) => (current === 'month' ? null : 'month'))
              }
              options={MONTH_OPTIONS}
              selectedLabel={String(selectedMonth).padStart(2, '0')}
              selectedValue={selectedMonth}
              onOptionPress={handleSelectMonth}
            />

            <AccountsPayableSelectField
              label="Year"
              isOpen={openFilter === 'year'}
              onToggle={() =>
                setOpenFilter((current) => (current === 'year' ? null : 'year'))
              }
              options={YEAR_OPTIONS.map((value) => ({
                label: String(value),
                value,
              }))}
              selectedLabel={String(selectedYear)}
              selectedValue={selectedYear}
              onOptionPress={handleSelectYear}
            />
          </View>

          <Pressable
            onPress={handleSearchAccountsPayable}
            disabled={isSearching}
            style={[styles.searchButton, isSearching && styles.buttonDisabled]}>
            {isSearching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>View monthly summary</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Latest summary</Text>
          <Text style={styles.summaryValue}>{formatCurrency(lastSearchTotal)}</Text>
          <Text style={styles.summaryCaption}>
            {records.length > 0
              ? `${records.length} bills loaded for ${String(selectedMonth).padStart(2, '0')}/${selectedYear}.`
              : 'No bills loaded yet. Search a month to keep the latest result here.'}
          </Text>
        </View>
      </ScrollView>

      <AccountsPayableResultsModal
        visible={isResultsModalVisible}
        onClose={() => setIsResultsModalVisible(false)}
        records={records}
        month={selectedMonth}
        year={selectedYear}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        isDeletingId={isDeletingId}
      />

      <AccountsPayableEditModal
        visible={Boolean(editingRecord)}
        onClose={handleCloseEditModal}
        description={editFormState.description}
        amount={editFormState.amount}
        dueDate={editFormState.dueDate}
        isPaid={editFormState.isPaid}
        minimumDueDate={minimumDueDate}
        onDescriptionChange={(value) => setEditFormState((current) => ({ ...current, description: value }))}
        onAmountChange={(value) => setEditFormState((current) => ({ ...current, amount: value }))}
        onDueDateChange={(value) => setEditFormState((current) => ({ ...current, dueDate: value }))}
        onPaidChange={(value) => setEditFormState((current) => ({ ...current, isPaid: value }))}
        onSubmit={handleSubmitEdit}
        isSubmitting={isUpdating}
      />
    </SafeAreaView>
  );
}

function buildPayload(formState: FormState, status: AccountsPayableReadDTO['status'] | null = null): AccountsPayableInsertDTO | null {
  const parsedAmount = Number.parseFloat(formState.amount.replace(',', '.'));

  if (!formState.description.trim() || !formState.dueDate.trim() || Number.isNaN(parsedAmount)) {
    return null;
  }

  return {
    description: formState.description.trim(),
    amount: parsedAmount,
    dueDate: formState.dueDate.trim(),
    status,
  };
}

function buildUpdatePayload(
  formState: EditFormState,
  originalStatus: PaymentStatus
): AccountsPayableInsertDTO | null {
  const parsedAmount = Number.parseFloat(formState.amount.replace(',', '.'));

  if (!formState.description.trim() || !formState.dueDate.trim() || Number.isNaN(parsedAmount)) {
    return null;
  }

  const nextStatus = formState.isPaid ? 'PAID' : getUnpaidStatus(originalStatus);

  return {
    description: formState.description.trim(),
    amount: parsedAmount,
    dueDate: formState.dueDate.trim(),
    status: nextStatus,
  };
}

function getUnpaidStatus(originalStatus: PaymentStatus): PaymentStatus {
  if (originalStatus === 'PAID') {
    return 'PENDING';
  }

  return originalStatus;
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

function getTodayDate(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECF1F7',
  },
  content: {
    padding: 20,
    paddingBottom: 20,
    gap: 18,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 38,
  },
  panel: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  panelHeader: {
    gap: 6,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  panelSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#51606F',
  },
  formGroup: {
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formColumn: {
    flex: 1,
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#0B6E4F',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  searchButton: {
    borderRadius: 18,
    backgroundColor: '#1D4ED8',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#DFF3E7',
    gap: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B3B2E',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0B3B2E',
  },
  summaryCaption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#285547',
  },
});
