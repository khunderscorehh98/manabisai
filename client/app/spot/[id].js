import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { fetchSpotById, fetchReviews } from '../../services/api';

const NEON = '#39FF14';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [spotData, reviewsData] = await Promise.all([
          fetchSpotById(id),
          fetchReviews(id),
        ]);
        setSpot(spotData);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to fetch spot:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={NEON} />
      </View>
    );
  }

  if (!spot) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Spot not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Header */}
      <View style={styles.header}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{spot.category}</Text>
        </View>
        <Text style={styles.name}>{spot.name}</Text>
        <View style={styles.metaRow}>
          {spot.is_halal && (
            <View style={styles.halalBadge}>
              <View style={styles.halalDot} />
              <Text style={styles.halalText}>Halal Certified</Text>
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingValue}>
              {spot.average_rating ? Number(spot.average_rating).toFixed(1) : '—'} / 5.0
            </Text>
          </View>
        </View>
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Location</Text>
        <Text style={styles.address}>{spot.address || 'No address listed'}</Text>
        <Text style={styles.coords}>
          {Number(spot.latitude).toFixed(4)}, {Number(spot.longitude).toFixed(4)}
        </Text>
      </View>

      {/* About Card */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>About</Text>
        <Text style={styles.description}>{spot.description || 'No description available.'}</Text>
      </View>

      {/* Reviews Card */}
      <View style={styles.card}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.cardLabel}>Reviews</Text>
          <View style={styles.reviewCount}>
            <Text style={styles.reviewCountText}>{reviews.length}</Text>
          </View>
        </View>

        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet — be the first!</Text>
        ) : (
          reviews.map((r, index) => (
            <View
              key={r.id}
              style={[
                styles.reviewItem,
                index < reviews.length - 1 && styles.reviewBorder,
              ]}
            >
              <View style={styles.reviewTop}>
                <Text style={styles.reviewUser}>{r.user_name}</Text>
                <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
              <Text style={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { paddingBottom: 120 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' },
  notFound: { fontSize: 16, color: '#888' },

  header: {
    padding: 24,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(64,196,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(64,196,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#40C4FF', letterSpacing: 0.5 },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  halalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(57,255,20,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(57,255,20,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  halalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NEON,
    shadowColor: NEON,
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  halalText: { fontSize: 11, fontWeight: '700', color: NEON },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,179,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,179,0,0.2)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ratingStar: { color: '#FFB300', fontSize: 12 },
  ratingValue: { fontSize: 12, fontWeight: '700', color: '#FFB300' },

  card: {
    backgroundColor: '#141414',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  address: { fontSize: 15, color: '#bbb', lineHeight: 22 },
  coords: { fontSize: 11, color: '#666', marginTop: 6, fontFamily: 'monospace' },
  description: { fontSize: 14, color: '#aaa', lineHeight: 22 },

  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reviewCount: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  reviewCountText: { fontSize: 11, color: '#777', fontWeight: '600' },
  noReviews: { fontSize: 13, color: '#777', fontStyle: 'italic' },
  reviewItem: {
    paddingVertical: 12,
  },
  reviewBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUser: { fontWeight: '700', fontSize: 13, color: '#fff' },
  reviewStars: { fontSize: 12, color: '#FFB300', letterSpacing: 1 },
  reviewComment: { fontSize: 13, color: '#999', lineHeight: 20 },
  reviewDate: { fontSize: 11, color: '#666', marginTop: 4 },
});
