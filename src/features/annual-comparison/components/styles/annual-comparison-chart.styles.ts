import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 12,
    gap: 16,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  captionBlock: {
    gap: 4,
    paddingHorizontal: 8,
  },
  captionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  captionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#51606F',
  },
});
