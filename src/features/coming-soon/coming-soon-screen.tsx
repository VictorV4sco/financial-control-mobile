import { StyleSheet, Text, View } from 'react-native';

type ComingSoonScreenProps = {
  description: string;
  title: string;
};

export function ComingSoonScreen({ title, description }: ComingSoonScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Coming soon</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
