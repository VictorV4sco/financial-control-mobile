import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 6,
  },
  cardFullWidth: {
    width: '100%',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#64748B',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptyCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
});
