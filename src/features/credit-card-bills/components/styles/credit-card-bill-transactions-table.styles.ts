import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tableCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0F7',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerCell: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#334155',
    textTransform: 'uppercase',
  },
  columnName: {
    flex: 1.65,
    paddingRight: 8,
  },
  columnDate: {
    flex: 1.35,
    paddingRight: 8,
  },
  columnPrice: {
    width: 88,
    textAlign: 'right',
    paddingRight: 8,
  },
  columnDetails: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnDetailsHeader: {
    width: 56,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cellText: {
    fontSize: 13,
    color: '#0F172A',
  },
  detailsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonPressed: {
    opacity: 0.82,
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
