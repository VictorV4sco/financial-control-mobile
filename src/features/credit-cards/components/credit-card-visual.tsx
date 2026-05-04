import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { styles } from './styles/credit-card-visual.styles';

type CreditCardVisualProps = {
  cardId?: number;
  compact?: boolean;
  index: number;
  name: string;
};

const CARD_THEMES = [
  {
    backgroundColor: '#0F172A',
    accentColor: '#38BDF8',
    secondaryColor: '#1D4ED8',
    textColor: '#F8FAFC',
    mutedTextColor: '#BFDBFE',
  },
  {
    backgroundColor: '#113C2F',
    accentColor: '#34D399',
    secondaryColor: '#0F766E',
    textColor: '#F3FFF9',
    mutedTextColor: '#B7F7DB',
  },
  {
    backgroundColor: '#4C1D95',
    accentColor: '#F59E0B',
    secondaryColor: '#7C3AED',
    textColor: '#FAF5FF',
    mutedTextColor: '#E9D5FF',
  },
  {
    backgroundColor: '#3F1D38',
    accentColor: '#FB7185',
    secondaryColor: '#BE185D',
    textColor: '#FFF1F4',
    mutedTextColor: '#FBCFE8',
  },
];

export function CreditCardVisual({
  name,
  index,
  cardId,
  compact = false,
}: CreditCardVisualProps) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <View
      style={[
        styles.card,
        compact ? styles.cardCompact : styles.cardRegular,
        { backgroundColor: theme.backgroundColor },
      ]}>
      <View style={[styles.glowCircle, styles.glowCirclePrimary, { backgroundColor: theme.accentColor }]} />
      <View
        style={[
          styles.glowCircle,
          styles.glowCircleSecondary,
          { backgroundColor: theme.secondaryColor },
        ]}
      />
      <View
        style={[
          styles.arcShape,
          { borderColor: theme.mutedTextColor },
        ]}
      />

      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="card-outline" size={18} color={theme.textColor} />
        </View>
        <View style={styles.headerTextBlock}>
          <Text style={[styles.brand, { color: theme.mutedTextColor }]}>FINANCIAL CONTROL</Text>
          {typeof cardId === 'number' ? (
            <Text style={[styles.cardIdText, { color: theme.mutedTextColor }]}>
              ID {cardId}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.contentBlock}>
        <Text style={[styles.caption, { color: theme.mutedTextColor }]}>CARD NAME</Text>
        <Text style={[styles.nameText, { color: theme.textColor }]} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </View>
  );
}
