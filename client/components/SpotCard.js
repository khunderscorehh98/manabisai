import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const NEON = '#39FF14';

export default function SpotCard({ spot, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>{spot.name}</Text>
        {spot.is_halal && (
          <View style={styles.halalBadge}>
            <View style={styles.halalDot} />
            <Text style={styles.halalText}>Halal</Text>
          </View>
        )}
      </View>

      <View style={styles.categoryRow}>
        <Text style={styles.category}>{spot.category}</Text>
      </View>

      <Text style={styles.address} numberOfLines={1}>
        📍 {spot.address || 'No address'}
      </Text>

      <View style={styles.footer}>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingValue}>
            {spot.average_rating ? Number(spot.average_rating).toFixed(1) : '—'}
          </Text>
        </View>
        <View style={styles.chevron}>
          <Text style={styles.chevronText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#141414',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  halalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57,255,20,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.25)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  halalDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: NEON,
    shadowColor: NEON,
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  halalText: {
    fontSize: 10,
    fontWeight: '700',
    color: NEON,
    letterSpacing: 0.5,
  },
  categoryRow: {
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: '#40C4FF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  address: {
    fontSize: 12,
    color: '#777',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingTop: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStar: {
    color: '#FFB300',
    fontSize: 14,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  chevron: {},
  chevronText: {
    color: '#555',
    fontSize: 22,
    lineHeight: 22,
  },
});
