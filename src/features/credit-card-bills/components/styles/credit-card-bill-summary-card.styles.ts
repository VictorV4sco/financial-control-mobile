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
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    padding: 14,
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionButton: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: '#0F172A',
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
