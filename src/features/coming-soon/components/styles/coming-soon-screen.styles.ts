import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF1F7',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    backgroundColor: '#0F172A',
    padding: 24,
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: '#7DD3FC',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#CBD5E1',
  },
});
