import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 13, 25, 0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: '#F6F8FB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: '#51606F',
  },
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    gap: 18,
    paddingBottom: 12,
  },
  chartCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    alignItems: 'center',
    gap: 16,
  },
  chartSummary: {
    alignItems: 'center',
    gap: 4,
  },
  chartSummaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#51606F',
  },
  chartSummaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusSummaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    minWidth: '31%',
    flexGrow: 1,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 6,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusValue: {
    fontSize: 13,
    color: '#51606F',
  },
  statusAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 18,
    gap: 16,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    gap: 14,
  },
  recordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  legendLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#51606F',
  },
  legendAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledActionButton: {
    opacity: 0.7,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B91C1C',
  },
});
