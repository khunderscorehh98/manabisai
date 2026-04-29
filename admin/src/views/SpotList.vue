<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Food Spots</h1>
        <p class="page-subtitle">Manage and moderate all food spots in Brunei</p>
      </div>
      <v-btn
        color="primary"
        to="/spots/new"
        elevation="0"
        class="add-btn"
      >
        <v-icon left small>mdi-plus</v-icon>
        Add Spot
      </v-btn>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ spots.length }}</div>
        <div class="stat-label">Total Spots</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #39FF14;">{{ halalCount }}</div>
        <div class="stat-label">Halal Certified</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #40C4FF;">{{ avgRating }}</div>
        <div class="stat-label">Avg Rating</div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        :items="spots"
        :loading="loading"
        loading-text="Loading spots..."
        no-data-text="No spots found"
        class="dark-table"
        :items-per-page="15"
      >
        <template v-slot:item.name="{ item }">
          <div>
            <div class="spot-name">{{ item.name }}</div>
            <div class="spot-address">{{ item.address || '—' }}</div>
          </div>
        </template>

        <template v-slot:item.category="{ item }">
          <v-chip
            x-small
            outlined
            style="border-color: rgba(64,196,255,0.4); color: #40C4FF; font-size: 11px;"
          >{{ item.category }}</v-chip>
        </template>

        <template v-slot:item.is_halal="{ item }">
          <div class="d-flex align-center" style="gap: 6px;">
            <div :style="{
              width: '7px', height: '7px', borderRadius: '50%',
              background: item.is_halal ? '#39FF14' : '#555',
              boxShadow: item.is_halal ? '0 0 6px #39FF14' : 'none',
            }"></div>
            <span :style="{ fontSize: '12px', color: item.is_halal ? '#39FF14' : '#555', fontWeight: 600 }">
              {{ item.is_halal ? 'Halal' : 'Non-Halal' }}
            </span>
          </div>
        </template>

        <template v-slot:item.average_rating="{ item }">
          <div class="d-flex align-center" style="gap: 4px;">
            <v-icon x-small color="#FFB300">mdi-star</v-icon>
            <span style="font-size: 13px; color: #fff; font-weight: 600;">
              {{ item.average_rating ? Number(item.average_rating).toFixed(1) : '—' }}
            </span>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex" style="gap: 4px;">
            <v-btn
              icon
              x-small
              @click="$router.push(`/spots/${item.id}/edit`)"
              title="Edit"
              style="color: #666;"
            >
              <v-icon small>mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn
              icon
              x-small
              color="error"
              @click="deleteSpot(item.id)"
              title="Delete"
            >
              <v-icon small>mdi-trash-can-outline</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SpotList',
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Halal', value: 'is_halal' },
        { text: 'Rating', value: 'average_rating' },
        { text: '', value: 'actions', sortable: false, width: '80px' },
      ],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['spots']),
    halalCount() {
      return this.spots.filter((s) => s.is_halal).length;
    },
    avgRating() {
      if (!this.spots.length) return '—';
      const rated = this.spots.filter((s) => s.average_rating);
      if (!rated.length) return '—';
      const avg = rated.reduce((sum, s) => sum + Number(s.average_rating), 0) / rated.length;
      return avg.toFixed(1);
    },
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('fetchSpots');
    this.loading = false;
  },
  methods: {
    async deleteSpot(id) {
      if (confirm('Delete this spot?')) {
        await this.$store.dispatch('deleteSpot', id);
      }
    },
  },
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.page-subtitle {
  font-size: 13px;
  color: #444;
  margin-top: 4px;
}

.add-btn {
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  color: #0A0A0A !important;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.25) !important;
  height: 40px !important;
  padding: 0 18px !important;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: #141414;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 16px 20px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: 6px;
  font-weight: 600;
}

.table-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.07);
}

.spot-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.spot-address {
  font-size: 12px;
  color: #444;
  margin-top: 2px;
}
</style>
