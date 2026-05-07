import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  emptyState: {
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    padding: 18,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyDescription: {
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    backgroundColor: '#F8FAFC',
    padding: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    borderColor: '#1D4ED8',
    backgroundColor: '#1D4ED8',
  },
  checkboxContent: {
    flex: 1,
    gap: 2,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  checkboxHint: {
    fontSize: 13,
    lineHeight: 18,
    color: '#51606F',
  },
  actionButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#0B6E4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.75,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
