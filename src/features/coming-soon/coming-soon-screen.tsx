import { Text, View } from 'react-native';
import { styles } from './components/styles/coming-soon-screen.styles';

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
