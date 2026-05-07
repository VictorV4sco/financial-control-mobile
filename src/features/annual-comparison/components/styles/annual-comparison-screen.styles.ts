import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECF1F7',
  },
  content: {
    padding: 20,
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
  loadingCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    padding: 28,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#425466',
  },
});
