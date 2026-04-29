<template>
  <div>
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Categories</h1>
        <p class="page-subtitle">Manage food spot categories</p>
      </div>
    </div>

    <div class="content-grid">
      <!-- Add Category Card -->
      <v-card elevation="0" class="form-card">
        <v-card-text class="pa-6">
          <div class="section-label">New Category</div>

          <v-form @submit.prevent="addCategory">
            <div class="field-label">Category Name</div>
            <v-text-field
              v-model="newCategory"
              placeholder="e.g. Nasi, Mee, Desserts..."
              outlined
              dense
              required
              prepend-inner-icon="mdi-tag-outline"
            ></v-text-field>

            <v-alert v-if="error" type="error" dense text class="mb-4" style="border-radius: 10px; font-size: 13px;">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              :loading="loading"
              elevation="0"
              block
              class="submit-btn"
            >
              <v-icon left small>mdi-plus</v-icon>
              Add Category
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <!-- Category List Card -->
      <v-card elevation="0" class="list-card">
        <v-card-text class="pa-6">
          <div class="section-label">All Categories ({{ categories.length }})</div>

          <div v-if="!categories.length" class="empty-state">
            <v-icon style="color: #333; font-size: 36px;">mdi-tag-off-outline</v-icon>
            <p style="color: #444; font-size: 13px; margin-top: 12px;">No categories yet</p>
          </div>

          <div v-else class="categories-list">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="category-item"
            >
              <div class="d-flex align-center" style="gap: 10px;">
                <div class="cat-dot"></div>
                <span class="cat-name">{{ cat.name }}</span>
              </div>
              <span class="cat-id">#{{ cat.id }}</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import api from '../services/api';

export default {
  name: 'CategoryList',
  data() {
    return { newCategory: '', error: '', loading: false };
  },
  computed: { ...mapGetters(['categories']) },
  async mounted() {
    await this.$store.dispatch('fetchCategories');
  },
  methods: {
    async addCategory() {
      this.loading = true;
      this.error = '';
      try {
        await api.post('/categories', { name: this.newCategory });
        this.newCategory = '';
        await this.$store.dispatch('fetchCategories');
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add category';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.page-header {
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

.content-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  align-items: start;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #39FF14;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(57, 255, 20, 0.1);
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.submit-btn {
  height: 44px !important;
  border-radius: 10px !important;
  background: #39FF14 !important;
  color: #0A0A0A !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.2) !important;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.cat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #39FF14;
  box-shadow: 0 0 6px rgba(57, 255, 20, 0.5);
  flex-shrink: 0;
}

.cat-name {
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
}

.cat-id {
  font-size: 11px;
  color: #333;
  font-family: monospace;
}
</style>
