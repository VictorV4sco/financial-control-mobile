import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  cardRegular: {
    minHeight: 208,
    padding: 20,
  },
  cardCompact: {
    minHeight: 164,
    padding: 18,
  },
  glowCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.18,
  },
  glowCirclePrimary: {
    width: 180,
    height: 180,
    right: -38,
    top: -34,
  },
  glowCircleSecondary: {
    width: 120,
    height: 120,
    left: -30,
    bottom: -38,
  },
  arcShape: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 999,
    borderWidth: 22,
    right: -34,
    bottom: -52,
    opacity: 0.22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cardIdText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  contentBlock: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 8,
  },
  caption: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
});
