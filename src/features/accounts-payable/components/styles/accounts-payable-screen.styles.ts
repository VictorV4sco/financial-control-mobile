import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
